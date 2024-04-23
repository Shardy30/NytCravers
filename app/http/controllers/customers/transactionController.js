const https = require('https');
const PaytmChecksum = require('paytmchecksum');
function transactionController() {
    return {
      async index(req, res) {
const {neworder}= req.body
const order= neworder
/* initialize an object */
var getAllresponse = JSON.parse(JSON.stringify(req.body));
      var paymentChecksumres = getAllresponse.CHECKSUMHASH
      var isVerifyChecksumhash = PaytmChecksum.verifySignature(getAllresponse, process.env.MERCHANT_KEY, paymentChecksumres);
      if(isVerifyChecksumhash){
        const order=getAllresponse.newOrder 
        const mid=getAllresponse.mid
        /* initialize an object */
        var paytmParams = {};

        /* body parameters */
        paytmParams.body = {

          /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
          "mid": mid,

          /* Enter your order id which needs to be check status for */
          "orderId": order._id
        };

        /**
        * Generate checksum by parameters we have in body
        * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
        */
        var response = "";
        PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.MERCHANT_KEY).then(function (checksum) {
          /* head parameters */
          paytmParams.head = {

            /* put generated checksum value here */
            "signature": checksum
          };

          /* prepare JSON string for request */
          var post_data = JSON.stringify(paytmParams);

          var options = {

            /* for Staging */
            hostname: 'securegw-stage.paytm.in',

            /* for Production */
            // hostname: 'securegw.paytm.in',

            port: 443,
            path: '/v3/order/status',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': post_data.length
            }
          };

          // Set up the request
          var post_req = https.request(options, function (post_res) {
            post_res.on('data', function (chunk) {
              response += chunk;
            });

            post_res.on('end', function () {
              console.log('Response: ', response);
              var res_obj= JSON.parse(response)

              var isVerifySignature=PaytmChecksum.verifySignature(JSON.stringify(res_obj.body),process.env.MERCHANT_KEY,res_obj.head.signature)
              if(isVerifySignature){

              }
              else{
                console.log("Signature mismatched")
              }
            });
          });
       
          // post the data
          post_req.write(post_data);
          post_req.end();

        });
      }else
      {
      console.log("mismatched signature")
      }      


}}}