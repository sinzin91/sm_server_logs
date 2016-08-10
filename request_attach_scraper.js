request({
  uri: "http://54.152.134.12:3000/attachScraper",
  method: "PUT",
  json: {
    action: "create",
    fieldType: {
      name: "n$name",
      valueType: { primitive: "STRING" },
      scope: "versioned",
      namespaces: { "my.demo": "n" }
    }
  }
});