<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExportReportRequest;
use App\Http\Traits\HasApiResponse;
use App\Jobs\GenerateReportJob;
use App\Services\ExportService;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ExportController extends Controller
{
    use HasApiResponse;

    protected ExportService $exportService;
    protected ReportService $reportService;

    public function __construct(ExportService $exportService, ReportService $reportService)
    {
        $this->exportService = $exportService;
        $this->reportService = $reportService;
    }

    /**
     * Export report
     */
    public function export(ExportReportRequest $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            $reportType = $request->input('report_type');
            $format = $request->input('format');
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
            $filters = $request->input('filters', []);

            $parameters = [
                'format' => $format,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'filters' => $filters,
            ];

            // Generate report in background job for large datasets
            if ($format === 'excel' || $format === 'pdf') {
                GenerateReportJob::dispatch($reportType, $parameters, $user->email);
                
                return $this->successResponse([
                    'message' => 'Report generation started. You will receive an email when it\'s ready.',
                    'status' => 'processing',
                ], 'Report generation started');
            }

            // For CSV and JSON, generate immediately
            $reportData = $this->reportService->generateCustomReport($reportType, $parameters);
            
            $filename = $reportType . '_report_' . now()->format('Y-m-d');
            
            $exportPath = match ($format) {
                'csv' => $this->exportService->exportToCsv(
                    collect($reportData),
                    $filename,
                    array_keys($reportData['summary'] ?? [])
                ),
                'json' => $this->exportService->exportToJson(
                    collect($reportData),
                    $filename
                ),
                default => null,
            };

            if ($exportPath) {
                return $this->successResponse([
                    'download_url' => $exportPath,
                    'filename' => $filename . '.' . $format,
                ], 'Report exported successfully');
            }

            return $this->errorResponse('Failed to export report', 500);
        } catch (\Exception $e) {
            Log::error('ExportController@export error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to export report', 500);
        }
    }
}

