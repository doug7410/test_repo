<?php

namespace App\Jobs;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class GoodRxDrugIdJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    private $drug;
    public $timeout = 30;
    private $baseUrl;

    /**
     * Create a new job instance.
     *
     * @param $drug
     */
    public function __construct($drug, $baseUrl)
    {
        $this->drug = $drug;
        $this->baseUrl = $baseUrl;
    }


    /**
     * @throws GuzzleException
     * @throws \Exception
     */
    public function handle()
    {
        $drug = (array) $this->drug;
        if($this->drug->goodrx_id) {
            dump("good_rx ID exists for {$this->drug->goodrx_name}. kick off scrape API job");
//            ScrapeGoodrxApiJob::dispatch((array) $this->drug, '98030', $this->baseUrl)->onQueue('goodrx');
            return;
        }

        $client = new Client();

        $response = $client->request(
            'POST',
            "{$this->baseUrl}/goodRx/scrapeDrugId",
            [
                'form_params' => [
                    'goodrx_name' => $this->drug->goodrx_name,
                    'goodrx_dosage' => $this->drug->goodrx_dosage,
                    'goodrx_form' => $this->drug->goodrx_form,
                    'goodrx_qty' => $this->drug->goodrx_qty
                ]
            ]
        );

        $response = json_decode($response->getBody());

        if ($response->type === 'error') {
           throw new \Exception($response->message .  ' Drug ID: ' . $this->drug->id);
        }

        $goodRxDrugID = $response->data->goodrxDrugId;
        dump($goodRxDrugID);
        dump(config('scrape_tables.goodrx.pull_table'));

        \DB::table(config('scrape_tables.goodrx.pull_table'))
            ->where('id', $this->drug->id)
            ->update(['goodrx_id' => $goodRxDrugID]);

        dump('kick off API job');
        $drug['goodrx_id'] = $goodRxDrugID;
//        ScrapeGoodrxApiJob::dispatch($drug, '98030', $this->baseUrl)->onQueue('goodrx');
        return;
    }
}
