{
    "variables":{
        "opencv_dir%":"C:/Program Files/opencv"
    },
  "targets": [
    {
        "include_dirs": [
            "<!@(node -p \"require('node-addon-api').include\")",
            "C:/Program Files/opencv/build/include",
            "D:/poco-1.12.4/Net/include",
            "D:/poco-1.12.4/Util/include",
            "D:/poco-1.12.4/Foundation/include",
            "D:/poco-1.12.4/JSON/include"
          ],
        "target_name": "native",
        "sources": [ "main_poco.cpp" ],
         'libraries': [
             "iphlpapi.lib",
             "ws2_32.lib",
                "-l<(opencv_dir)/build/x64/vc16/lib/opencv_world480.lib",
                "D:/poco-1.12.4/poco-x64-build/lib/Release/PocoFoundationmt.lib",
                "D:/poco-1.12.4/poco-x64-build/lib/Release/PocoNetmt.lib",
                "D:/poco-1.12.4/poco-x64-build/lib/Release/PocoJSONmt.lib",
                "D:/poco-1.12.4/poco-x64-build/lib/Release/PocoUtilmt.lib",
                 "D:/poco-1.12.4/poco-x64-build/lib/Release/PocoXMLmt.lib"
              ],

        "defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS',"NODE_ADDON_API_ENABLE_MAYBE"]
    }
  ]
}