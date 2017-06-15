# Watson NLCトレーニング用 データとツール

Watson NLC API を利用したツールで、ファイル名と役割のリストです。

| ファイル名       | 説明                         |
|:-----------------|:-----------------------------|
| README.md        |このファイル                  |
| greetings.csv    |訓練データ                    |
| nlc_create.js    |分類器の作成とトレーニング    |
| nlc_delete.js    |削除                          |
| nlc_list.js      |一覧作成                      |
| nlc_status.js    |各分類器の状態リスト          |
| nlc_test.js      |分類テスト                    |
| nlc_set_classifier_id.js | 分類器IDのセット     |
| package.json     |npmパッケージ                 |
| sharedlib_cdb.js |CloudantDBへの接続共通部      |
| sharedlib_nlc.js |WatsonNLCへの接続共通部       |
| sharedlib_vcap.js|VCAP環境取得用共通部          |


## 分類器の作成とトレーニング

コマンドの引数は、言語、NLC名、トレーニング用のCSVファイル名です。 分類器IDをCloudant データベースに登録して、トレーニングを開始します。 トレーニングの終了は、nlc_status.js で確認することができます。トレーニングが完了した分類器は、nlc_test.js で対話式に言葉をインプットして分類結果を確認することができます。

使用例

~~~
./nlc_create.js ja greetings greetings.csv
~~~


## 分類器のトレーニング完了の確認

Cloudant のデータベースから分類器のIDを取り出して Watson NLCの状態を取得しています。

使用例

~~~
./nlc_status.js
~~~


## 分類器のリスト

Watson に登録されている分類器のリストで、Cloudant のデータベースを利用していません。

使用例

~~~
./nlc_list.js
~~~


## 分類器の削除

分類器のIDを指定して削除します。Watson NLC から 分類器削除されると共に、Cloudant のデータベースからも削除されます。

使用例

~~~
./nlc_delete.js 67a480x203-nlc-21830 67a480x203-nlc-21829
~~~


## 分類器のテスト

分類器のIDを指定して、コマンドラインの対話式で分類器のテストを実施します。

使用例

~~~
./nlc_test.js 67a480x203-nlc-21924
NLC> こんばんは
{
  "classifier_id": "67a480x203-nlc-21924",
  "url": "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/67a480x203-nlc-21924",
  "text": "こんばんは",
  "top_class": "夜挨拶",
  "classes": [
    {
      "class_name": "夜挨拶",
      "confidence": 1
    },
    {
      "class_name": "挨拶",
      "confidence": 0
    },
    {
      "class_name": "共感",
      "confidence": 0
    },
<中略>
~~~



## 分類器のIDセット

アプリで分類器を複数利用するケースを想定して、アプリが利用する分類器のIDをDBへセットします。
これは、Cloudant の nlcid のデータベースに、キー **current_classifier_id** で保存されます。

使用例 セットまたは更新

~~~
./nlc_set_classifier_id.js set 67a480x203-nlc-21924
~~~
使用例 削除

~~~
./nlc_set_classifier_id.js del
~~~

