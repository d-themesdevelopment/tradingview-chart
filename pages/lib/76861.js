
  
  function environment(host = location.host) {
    const battleHosts = [
      "i18n.tradingview.com",
      "partial.tradingview.com",
      "www.tradingview.com",
      "wwwcn.tradingview.com",
    ];
    const stagingHosts = [
      "d33t3vvu2t2yu5.cloudfront.net",
      "dwq4do82y8xi7.cloudfront.net",
      "s.tradingview.com",
      "s3.tradingview.com",
    ];
  
    if (
      battleHosts.includes(host) ||
      stagingHosts.includes(host) ||
      host.match(/^[a-z]{2}\.tradingview\.com/) ||
      host.match(/prod-[^.]+.tradingview.com/)
    ) {
      return "battle";
    } else if (host.includes("tradingview.com") || host.includes("staging")) {
      return "staging";
    } else if (host.match(/webcharts/)) {
      return "staging_local";
    } else if (host.match(/^localhost(:\d+)?$/)) {
      return "local";
    } else {
      return "local";
    }
  }
  
  function isLocal() {
    return environment() === "local";
  }
  
  function isProd() {
    return environment() === "battle";
  }
  
  function isDebug() {
    return !isProd();
  }