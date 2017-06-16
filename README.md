# Facebook チャットボット Watson NLC 版

Bluemix の CFアプリ または Bluemix IaaS で動作するFacebook チャットボットです。 Watson NLC を利用して受信メッセージをクラス分類して、適切なメッセージを返す振る舞いをします。

Bluemix の Watson NLC と Cloudant のサービスと接続する方法は、Qiitの[Watson チャットボットの作り方 第３回目](http://qiita.com/MahoTakara/private/28dee5ed8d4e02e5ab04)を参照ねがいます。また、NLCのトレーニングデータと応答用のデータ、及び、ツールは https://github.com/takara9/chatbot-corpus にあります。



## Bluemix CFアプリとして動作させる場合

* パソコンなど作業用の環境で以下のコマンドでファイルをダウンロードします。

~~~
git clone https://github.com/takara9/chatbot-echo-facebook
~~~


### Facebookの基本情報設定
* credentials.json.sample からserverの項目を削除してcredentials.jsonとして保存します。参考資料(1)を参考にして、Facebook から下記の項目をセットします。

~~~
{
    "pageID": "facebook page id",
    "appID": "facebook application id",
    "appSecret": "facebook applicaiton secret",
    "validationToken": "facebook validation token",
    "pageToken": "facebook page token"
}
~~~~

### Bluemix へのデプロイ
* Bluemix CLI をインストールします。参考情報(2)
* Bluemix CLI でログインして、下記のコマンドでCFアプリとしてデプロイします。 このコマンドは、manifest.ymlを読み取って実行します。 このファイルのhostが既に使われている場合、デプロイが失敗しますから、変更して再実行します。

~~~
bx cf push
~~~

* Webhooks を設定します。 こちらも参考資料(1)を参考にします。


## Bluemix Infrastructure 仮想サーバーで実行する場合

* Bluemix Infrastructure の仮想サーバーを最小条件で起動します。(CPUコア:1, RAM: 1GB, NIC: 100Mbps, Disk: local 25GB) 参考資料(3)
* 起動後のIPアドレスをDNSで参照できる様します。 参考資料(4)
* HTTPS 通信のためのデジタル証明書を取得します。 参考資料(5)
* credentials.json.sample を 編集して credentials.json として保存します。
* 各項目の取得は、参考資料(1)を参考にします。

~~~
{
    "pageID": "facebook page id",
    "appID": "facebook application id",
    "appSecret": "facebook applicaiton secret",
    "validationToken": "facebook validation token",
    "pageToken": "facebook page token",
    "https": {
        "key":  "lets_encript.key",
        "cert": "lets_encript_fullchain.crt"
    }
}
~~~
* 設定が完了したら、次のコマンドでアプリをスタートします。

~~~
npm start
~~~
* Webhooks を設定します。 こちらも参考資料(1)を参考にします。



## 参考資料
- (1) ジャスト30分！FBメッセンジャーbotをとりあえず作ってみる手順まとめ https://bita.jp/dml/facebookbot_exp
- (2) Bluemix CLIホーム https://clis.ng.bluemix.net/ui/home.html
- (3) CHANGE MAKERS 1.2 仮想サーバーを起動するには？ https://www.change-makers.jp/docs/softlayer-config-guide/10292
- (4) 私的MyDNS.JP https://www.mydns.jp/
- (5) Let's Encrypt 総合ポータル https://letsencrypt.jp/
- (6) npm facebook-bot-messenger https://www.npmjs.com/package/facebook-bot-messenger



