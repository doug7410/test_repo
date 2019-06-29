<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $toay = Carbon::today()->format('Y-m-d');
        $goodrxPullTable = config('scrape_tables.goodrx.pull_table');
        $goodrxDestTable = config('scrape_tables.goodrx.destination_table');
        $totalDrugs = \DB::table($goodrxPullTable)->whereNull('unavailable')->count();
        $totalDoneForToday = \DB::table($goodrxDestTable)->where('created_at', 'like', $toay . '%')
            ->select('drug_pull_id')
            ->groupBy('drug_pull_id')
            ->get()
            ->count();

        return [
            'goodrx' => [
                'total_drugs' => $totalDrugs,
                'done_so_far' => $totalDoneForToday
            ]
        ];
    }
}
