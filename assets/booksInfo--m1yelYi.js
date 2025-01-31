import{l as r}from"./function-insZNpSi.js";/* empty css              */import{c as d}from"./index-BHRf0dvD.js";const a="https://zwaptvdanmpkvskqdwtl.supabase.co",l="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3YXB0dmRhbm1wa3Zza3Fkd3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNDAwMzgsImV4cCI6MjA1MjYxNjAzOH0.yQvNbikw_J5NW4oMdfkK9YM-Uoeiu8nHCU_R4ClW0FI",m=d(a,l);async function I(){const t=new URLSearchParams(window.location.search).get("title");if(document.title=`${t}`,console.log(t),!t){console.error("No book provided");return}document.getElementById("book-title").textContent=`${t}`;const{data:n,error:e}=await m.from("books").select("*").eq("title",t);if(e){console.error("Error fetching book:",e);return}let o=n[0];const i=document.getElementById("book-img"),s=document.getElementById("disc"),c=document.getElementById("download");i.innerHTML=`
                <img class='img-fluid ' src="${o.img}" alt="" id="img">
            `,s.innerHTML=`
                <p class="text-center text-md-end">${o.description}</p>
            `,c.innerHTML=`
                <a href='${o.download_link}' class='btn btn-primary ' >Download</a>
            `}document.addEventListener("DOMContentLoaded",()=>{r(),I()});
