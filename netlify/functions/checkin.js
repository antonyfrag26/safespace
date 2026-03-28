exports.handler = async function(event) {
  if(event.httpMethod==='OPTIONS')return{statusCode:200,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'},body:''}
  const headers={'Access-Control-Allow-Origin':'*','Content-Type':'application/json'}
  try{
    const{name,day,mood,thought}=JSON.parse(event.body)
    const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer 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'},body:JSON.stringify({model:'llama-3.3-70b-versatile',max_tokens:200,temperature:0.7,messages:[{role:'system',content:'You are SafeSpace, a peer mentor. Respond to daily check-ins with warmth, precision, one grounding insight or gentle question. Under 70 words. No therapy-speak.'},{role:'user',content:'Check-in from '+name+' (day '+day+'):\nMood: '+mood+'\nThought: "'+(thought||'nothing shared')+'"'}]})})
    const data=await r.json()
    return{statusCode:200,headers,body:JSON.stringify({reply:data.choices?.[0]?.message?.content||'Checking in is courage.'})}
  }catch(e){return{statusCode:500,headers,body:JSON.stringify({error:'Server error'})}}
}
