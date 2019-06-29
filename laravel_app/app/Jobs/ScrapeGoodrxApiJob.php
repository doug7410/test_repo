<?php

namespace App\Jobs;

use Carbon\Carbon;
use DB;
use GuzzleHttp\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ScrapeGoodrxApiJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    private $drug;
    private $zipcode;
    public $timeout = 30;
    private $baseUrl;

    /**
     * Create a new job instance.
     *
     * @param $drug array
     * @param $zipcode
     * @param $baseUrl
     */
    public function __construct($drug, $zipcode, $baseUrl)
    {
        //
        $this->drug = $drug;
        $this->zipcode = $zipcode;
        $this->baseUrl = $baseUrl;
    }


    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     * @throws \Exception
     */
    public function handle()
    {
        $today = Carbon::today()->format('Y-m-d');
        $hasAlreadyBeenScraped = (bool) DB::table(config('scrape_tables.goodrx.destination_table'))
            ->where('created_at', 'like', $today.'%')
            ->where('drug_pull_id', $this->drug['id'])
            ->count();

        if($hasAlreadyBeenScraped) {
            dump('Drug ID: '. $this->drug['id'] . ' has already been scraped for ' . $today);
            return;
        }

        $client = new Client();
        $params = array_merge($this->drug, ['zipcode' => $this->zipcode]);

        $response = $client->request(
            'POST',
            "{$this->baseUrl}/goodRx/scrapeApi",
            [
                'form_params' => $params
            ]
        );

        $response = json_decode($response->getBody(), true);

        if ($response['type'] === 'error') {
            throw new \Exception(json_encode($response) .  ' Drug ID: ' . $this->drug['id']);
        }

        foreach ($response['data'] as $result) {
            $couponUrl = $result['couponUrl'];
            unset($result['couponUrl']);
            $result['drug_pull_id'] = $this->drug['id'];
            DB::table(config('scrape_tables.goodrx.destination_table'))->insert($result);
            dump('kick off coupon url job for ' . $result['goodrx_name'] . ' ' . $result['pharmacy']);
        }
    }
}
