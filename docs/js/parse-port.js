(function() {
    /*
     * Set cookie for c2proxy port number.
     *
     * https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
     */
    let queryDict = {};
    location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});

    if (queryDict.hasOwnProperty("c2proxy_port")) {
        createCookie("c2proxy_port", queryDict['c2proxy_port']);
    }
})();
