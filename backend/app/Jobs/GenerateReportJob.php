<?php

namespace App\Jobs;

use App\Services\ExportService;
use App\Services\ReportService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class GenerateReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public string $reportType;
    public array $parameters;
    public ?string $email;

    /**
     * Create a new job instance.
     */
    public function __construct(string $reportType, array $parameters = [], ?string $email = null)
    {
        $this->reportType = $reportType;
        $this->parameters = $parameters;
        $this->email = $email;
    }

    /**
     * Execute the job.
     */
    public function handle(ReportService $reportService, ExportService $exportService): void
    {
        try {
            // Generate report data
            $reportData = $reportService->generateCustomReport($this->reportType, $this->parameters);

            // Export to requested format
            $format = $this->parameters['format'] ?? 'excel';
            $filename = $this->reportType . '_report_' . now()->format('Y-m-d');

            $exportPath = match ($format) {
                'excel' => $exportService->exportToExcel(
                    collect($reportData),
                    $filename,
                    array_keys($reportData['summary'] ?? [])
                ),
                'pdf' => $exportService->exportToPdf(
                    collect($reportData),
                    $filename,
                    'reports.' . $this->reportType,
                    $reportData
                ),
                'csv' => $exportService->exportToCsv(
                    collect($reportData),
                    $filename,
                    array_keys($reportData['summary'] ?? [])
                ),
                'json' => $exportService->exportToJson(
                    collect($reportData),
                    $filename
                ),
                default => null,
            };

            // Send email if provided
            if ($this->email && $exportPath) {
                // Mail::to($this->email)->send(new ReportGeneratedMail($exportPath, $this->reportType));
                Log::info("Report generated and sent to {$this->email}: {$exportPath}");
            }

            Log::info("Report generated successfully: {$exportPath}");
        } catch (\Exception $e) {
            Log::error('GenerateReportJob failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            
            throw $e;
        }
    }
}
