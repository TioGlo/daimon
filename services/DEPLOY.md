# deployment guide

## option 1: fly.io (recommended)

```bash
# install flyctl
curl -L https://fly.io/install.sh | sh

# login
fly auth login

# launch (creates app, sets up regions)
fly launch --name mycel-gateway --region iad

# set secrets
fly secrets set PAY_TO_ADDRESS=0x9FffCdb0bB65Ac66D20179A4874fD965F1b1b2be

# deploy
fly deploy

# get url
fly status
```

## option 2: railway

```bash
# install railway CLI
npm install -g @railway/cli

# login
railway login

# init and deploy
railway init
railway up

# set env vars in dashboard or CLI
railway variables set PAY_TO_ADDRESS=0x9FffCdb0bB65Ac66D20179A4874fD965F1b1b2be
```

## option 3: render

1. push to github
2. create web service on render
3. set build command: `npm install`
4. set start command: `npm start`
5. add env vars

## registering on openx402.ai

once deployed:

```bash
# register your server
curl -X POST https://openx402.ai/api/register \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-gateway.fly.dev", "name": "mycel"}'
```

or visit https://openx402.ai/register and submit your URL.

## testing

```bash
# test free endpoint
curl https://your-gateway.fly.dev/health

# test paid endpoint (should return 402)
curl https://your-gateway.fly.dev/network/report
```

## monitoring

track revenue at:
- https://openx402.ai (public dashboard)
- your facilitator's dashboard (if using Coinbase)
