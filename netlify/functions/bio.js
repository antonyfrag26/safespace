exports.handler = async function(event) {
  if(event.httpMethod==='OPTIONS')return{statusCode:200,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'},body:''}
  const headers={'Access-Control-Allow-Origin':'*','Content-Type':'application/json'}
  try{
    const{onboarding,conversations,moodlog}=JSON.parse(event.body)
    const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer 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'},body:JSON.stringify({model:'llama-3.3-70b-versatile',max_tokens:1000,temperature:0.6,messages:[{role:'user',content:'Build a SafeSpace client profile. Return ONLY valid JSON:\n{"narrative":"2-3 paragraphs TO the client in second person","raw":"one paragraph for mentor AI","belief":"core limiting belief","avoiding":"what they avoid under overthinking","path":"3-4 concrete rebuilding sentences","patterns":"repeating patterns","summary":"max 20 word summary"}\n\nONBOARDING:\n'+onboarding+'\n\nCONVERSATIONS:\n'+conversations+'\n\nMOOD LOG:\n'+moodlog+'\n\nReturn ONLY valid JSON. No markdown.'}]})})
    const data=await r.json()
    let raw=data.choices?.[0]?.message?.content||''
    raw=raw.replace(/```json|```/g,'').trim()
    const bio=JSON.parse(raw)
    bio.generatedAt=new Date().toLocaleString('en-AU')
    return{statusCode:200,headers,body:JSON.stringify({bio})}
  }catch(e){return{statusCode:500,headers,body:JSON.stringify({error:'Server error'})}}
}
