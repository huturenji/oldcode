module.exports = {
    "presets": [
    ],
    "plugins": [
        [
            "import",[
                {
                    "libraryName": "sinosun-ui",
                    "libraryDirectory": "lib",
                    "customName": name => {
                        const prefix = "sn-";
                        if (name.indexOf(prefix) > -1) {
                            return `sinosun-ui/lib/${name.split(prefix)[1]}`;
                        } else if (name === 'transfer-dom') {
                            return `sinosun-ui/lib/directives/transfer-dom`;
                        }
                        return "";
                    }
                  }
            ]
        ]
    ]
}
