var editor = CodeMirror.fromTextArea(document.getElementById("area"), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true
    
  });
  editor.setOption("theme","dracula")
  const params=new URL(window.location.href)

  var txt=params.searchParams.get("query")
  var l=params.searchParams.get("lang")?params.searchParams.get("lang"):-1
  document.getElementById("lang").value=l
  editor.getDoc().setValue(txt?window.atob(txt):'');
  
  function share(){
        var s=editor.getValue()
        const urlParams = new URLSearchParams(window.location.search);

        urlParams.set('query', window.btoa(s));
        urlParams.set('lang',document.getElementById("lang").value)
        document.getElementById('url').value=window.location.origin+window.location.pathname+'?'+urlParams
        
        navigator.clipboard.writeText(window.location.origin+window.location.pathname+'?'+urlParams)
        alert("Copied to clipboard")
}

  let compiler;
  function check(){
    document.getElementById("console").innerText=""
    let lang=document.getElementById("lang").value

    switch (lang) {
        case "0":
            compiler="cg63"
            break;
        case "1":
            compiler="g82"
            break
        case "2":
            compiler="python310"
            
            break
        case "3":
            compiler="gfortran94"
            break
        
        default:
       
            break;
    }


    let data={
"source": editor.getValue(),
"compiler": compiler,
"options": {
    "userArguments": "-O3",
    "executeParameters": {
        "args": ["arg1", "arg2"],
        "stdin": document.getElementById("stdin").value,
    },
    "compilerOptions": {
        "executorRequest": true
    },
    "filters": {
        "execute": true
    },
    "tools": [],
    "libraries": [
        {"id": "openssl", "version": "111c"}
    ]
},
"allowStoreCodeDebug": true
}
    if(lang!=-1){
                fetch(`https://gcc.godbolt.org/api/compiler/${compiler}/compile`,
            {
                headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
                },
                method:"POST",
                body:JSON.stringify(data)
            }
            ).then((res)=>
                res.json()
            )
            .then((data)=>{
                console.log(data)
                if(data.code==0){
                    for(var i=0;i<data.stdout.length;i++){
                        document.getElementById("console").innerText+=`${data.stdout[i].text}\n`
                    }
                }
                else {
                    if(data.buildResult.stderr){
                        for(var i=0;i<data.buildResult.stderr.length;i++){
                            document.getElementById("console").innerText+=`${data.buildResult.stderr[i].text}\n`
                        }
                        }else{
                            for(var i=0;i<data.stderr.length;i++){
                                document.getElementById("console").innerText+=`${data.stderr[i].text}\n`
                            }
                        }
                
                
                    
                }
                
            })
    }

   
  }

 