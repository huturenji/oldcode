{
  "targets": [
    {
        "include_dirs": [
            "<!@(node -p \"require('node-addon-api').include\")"
            ],
        "target_name": "native",
        "sources": [ "main.cpp" ],
        "defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS',"NODE_ADDON_API_ENABLE_MAYBE" ]
    }
  ]
}