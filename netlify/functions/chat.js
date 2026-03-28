exports.handler = async function(event) {
  if(event.httpMethod==='OPTIONS')return{statusCode:200,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'},body:''}
  const headers={'Access-Control-Allow-Origin':'*','Content-Type':'application/json'}
  try{
    const{messages}=JSON.parse(event.body)
    const cleaned=messages.filter(m=>m.role&&m.content&&typeof m.content==='string'&&m.content.length>0&&m.content.length<4000).map(m=>({role:m.role==='ai'?'assistant':m.role,content:m.content})).filter(m=>['user','assistant','system'].includes(m.role))
    const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer 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'},body:JSON.stringify({model:'llama-3.3-70b-versatile',max_tokens:400,temperature:0.75,messages:cleaned})})
    const data=await r.json()
    if(!r.ok)return{statusCode:500,headers,body:JSON.stringify({error:data.error?.message||'AI error'})}
    return{statusCode:200,headers,body:JSON.stringify({reply:data.choices?.[0]?.message?.content||"I'm here."})}
  }catch(e){return{statusCode:500,headers,body:JSON.stringify({error:'Server error'})}}
}
