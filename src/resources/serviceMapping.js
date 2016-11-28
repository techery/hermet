let serviceMappings = [
  {
      name: "wv-merchant-services-qa",
      proxyHost:  "merchant-serive.proxy.io:5050",
      targetUrl: "http://dtldev-2085547781.us-east-1.elb.amazonaws.com"
  },
  {
    name: "merchant-service-preprod",
    proxyHost:  "merchant-service-preprod.proxy.io:5050",
    targetUrl: "http://techery-dt-preprod.techery.io:3020"
  }
];

module.exports = serviceMappings;