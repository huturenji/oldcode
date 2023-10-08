<template>
    <div id="urlMaking">
          
    </div>
</template>

<script>
export default {
    data() {
        return {}
            
    },

    components: {},
    props: {},
    
    
    mounted(){
        this.init()
    },
    methods:{
        init(){
            const myBody = document.getElementById('urlMaking')
            const myDiv = document.createElement('div')
            myBody.appendChild(myDiv)
            const list = [
                { id: 'input1', name: '环境地址：' },
                { id: 'input2', name: 'unionType：' },
                { id: 'input3', name: '链接url：' },
                { id: 'input4', name: '微信wxUrl：' },
                { id: 'input5', name: '深度链接deepLink：' }
            ]

            const frame = document.createDocumentFragment()
            for (let i = 0; i < 5; i++) {
                const inputDiv = document.createElement('div')
                // key
                const mySpan = document.createElement('span')
                mySpan.innerText = list[i].name
                mySpan.style.width = '120px'
                mySpan.style.display = 'inline-block'
                inputDiv.appendChild(mySpan)

                // input 框
                const myInput = document.createElement('input')
                myInput.style.padding = '0 10px'
                myInput.setAttribute('id', list[i].id)
                myInput.style.margin = '5px 0'
                myInput.style.border = '1px solid #000'
                myInput.style.width = 'calc(100% - 150px)'
                inputDiv.appendChild(myInput)

                if (i === 0) {
                    myInput.value = 'https://cloud.sinosun.com/mallbbcg2/static/mobile/index.html'
                } else if (i === 1) {
                    const tipsDiv = document.createElement('div')
                    tipsDiv.innerText = 'unionType 注意：JDU代表跳京东联盟， TBU代表跳淘宝联盟， VIPU代表跳唯品会联盟， PDDU代表跳拼多多联盟， KLU代表跳考拉联盟， SNU代表跳苏宁联盟， MEITUAN代表跳美团， ELEME代表跳饿了么'
                    tipsDiv.style.margin = '5px 0'
                    tipsDiv.style.color = '#f1a532'
                    inputDiv.appendChild(tipsDiv)
                }
                frame.appendChild(inputDiv)
            }
            myBody.appendChild(frame)

            // 生成按钮
            const btn1 = document.createElement('button')
            btn1.innerText = '生成'
            myBody.appendChild(btn1)

            const btn2 = document.createElement('button')
            btn2.innerText = '重置'
            btn2.style.marginLeft = '10px'
            myBody.appendChild(btn2)

            const myTextarea = document.createElement('textarea')
            myTextarea.style.width = '100%'
            myTextarea.style.height = '100px'
            myTextarea.style.marginTop = '20px'
            myBody.appendChild(myTextarea)


            let input1 = document.querySelector('#input1')
            let input2 = document.querySelector('#input2')
            let input3 = document.querySelector('#input3')
            let input4 = document.querySelector('#input4')
            let input5 = document.querySelector('#input5')

            btn1.onclick = function () {
                let openUrl = `${input1.value}#/pages/union/transfer?unionType=${encodeURIComponent(input2.value)}&url=${encodeURIComponent(input3.value)}&wxUrl=${encodeURIComponent(input4.value)}&deepLink=${encodeURIComponent(input5.value)}`;
                myTextarea.value = openUrl
            }

            btn2.onclick = function () {
                input1.value = 'https://cloud.sinosun.com/mallbbcg2/static/mobile/index.html'
                input2.value = ''
                input3.value = ''
                input4.value = ''
                input5.value = ''
            }
        }
    }

    
}
</script>

<style>
    
</style>

