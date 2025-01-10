import { env } from 'process';
import { config } from 'dotenv';
import express from 'express';
import axios from 'axios';
import xmlParser from 'express-xml-bodyparser';

if (!env.NODE_ENV || env.NODE_ENV === 'development') {
  config();
}
const app = express();
app.use(express.json());

const { PORT = 5000 } = env;

app.get('/api', async (req, res) => {
  console.log(req.query);
  res.status(200).send(req.query);
});

app.post('/api/get_asc_gzip', async (req, res) => {
  const { url } = req.body;
  const response = await axios({
    url,
    method: 'get',
    headers: {
      Accept: '*/*',
    },
    responseType: 'document',
    responseEncoding: 'binary',
  });

  const base64data = Buffer.from(response.data, 'binary').toString('base64');

  res.status(200).send(base64data);
});

app.get(
  '/api/pa-dnb/e0ece195-941f-4bf4-9556-413e6754f547',
  async (req, res) => {
    const date = +new Date();
    console.log({ body: req.body });
    console.log({ headers: req.headers });
    res.status(200).send(`GET is not available. ID: ${date}`);
  }
);
app.post(
  '/api/pa-dnb/e0ece195-941f-4bf4-9556-413e6754f547',
  xmlParser({
    explicitArray: false,
    trim: true,
  }),
  async (req, res) => {
    const nsResponse = await axios({
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0',
      },
      url: 'https://4114764.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2035&deploy=2&compid=4114764&h=809eb4d9ec8261e418b0',
      data: JSON.stringify(req.body),
    });
    if (nsResponse.status === 200) {
      res.status(200).type('application/xml')
        .send(`<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <soap:Body>
           <ns1:notifyEntityMessageResponse xmlns:ns1="http://outboundnotification.com">
              <ns1:out>
                 <entityNotificationResultDTO xsi:nil="true" xmlns="http://outboundnotification.com"/>
              </ns1:out>
           </ns1:notifyEntityMessageResponse>
        </soap:Body>
      </soap:Envelope>`);
    } else {
      console.log(nsResponse);
      res.status(200);
    }
  }
);

app.listen(PORT);

export default app;