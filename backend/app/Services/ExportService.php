<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportService
{
    /**
     * Export data to Excel
     */
    public function exportToExcel(Collection $data, string $filename, array $columns = []): string
    {
        $path = 'exports/' . $filename . '_' . now()->format('Y-m-d_His') . '.xlsx';
        
        Excel::store(
            new class($data, $columns) implements \Maatwebsite\Excel\Concerns\FromCollection, \Maatwebsite\Excel\Concerns\WithHeadings {
                protected $data;
                protected $columns;

                public function __construct($data, $columns)
                {
                    $this->data = $data;
                    $this->columns = $columns;
                }

                public function collection()
                {
                    return $this->data;
                }

                public function headings(): array
                {
                    return $this->columns ?: array_keys($this->data->first()->toArray() ?? []);
                }
            },
            $path,
            'public'
        );

        return Storage::disk('public')->url($path);
    }

    /**
     * Export data to PDF
     */
    public function exportToPdf(Collection $data, string $filename, string $view, array $viewData = []): string
    {
        $path = 'exports/' . $filename . '_' . now()->format('Y-m-d_His') . '.pdf';
        
        $pdf = Pdf::loadView($view, array_merge([
            'data' => $data,
        ], $viewData));

        Storage::disk('public')->put($path, $pdf->output());

        return Storage::disk('public')->url($path);
    }

    /**
     * Export data to CSV
     */
    public function exportToCsv(Collection $data, string $filename, array $columns = []): string
    {
        $path = 'exports/' . $filename . '_' . now()->format('Y-m-d_His') . '.csv';
        
        $file = fopen(Storage::disk('public')->path($path), 'w');

        // Write headers
        $headers = $columns ?: array_keys($data->first()->toArray() ?? []);
        fputcsv($file, $headers);

        // Write data
        foreach ($data as $row) {
            $rowArray = $row->toArray();
            $values = [];
            foreach ($headers as $header) {
                $values[] = $rowArray[$header] ?? '';
            }
            fputcsv($file, $values);
        }

        fclose($file);

        return Storage::disk('public')->url($path);
    }

    /**
     * Export data to JSON
     */
    public function exportToJson(Collection $data, string $filename): string
    {
        $path = 'exports/' . $filename . '_' . now()->format('Y-m-d_His') . '.json';
        
        Storage::disk('public')->put($path, json_encode($data, JSON_PRETTY_PRINT));

        return Storage::disk('public')->url($path);
    }
}

