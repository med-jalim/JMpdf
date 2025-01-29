import { createClient } from '@supabase/supabase-js';
import {insertData,deleteData,fetchdata,updateData,uploadFile} from './function';

// استبدل هذه القيم بالمفاتيح الخاصة بك
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);









document.addEventListener('DOMContentLoaded', async  function() {
    // Sample data - Replace this with your database data
    

    let messages= await fetchdata(supabase,'usersmessages','messages',true,true,'.messages-container') 


    
    const messageList = document.querySelector('.message-list');
    const messageDetail = document.getElementById('messageDetail');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('input[name="filter"]');


    const sidebarLinks = document.querySelectorAll('.sidebar-a');
    const adminSections= document.querySelectorAll('.adminSection');
    const selectCategory = document.getElementById('select-category');
    

    // --------------------------section movment------------------------
    sidebarLinks.forEach((link ) => {
        link.addEventListener('click',() => {

            sidebarLinks.forEach((item)=>{
                item.classList.remove('active')
            });
            adminSections.forEach((section)=>{
                if(section.id===link.role){
                    section.style.display = 'block';
                    link.classList.add('active')
                    
                }else{
                    section.style.display = 'none';
            }
            });
      });
    });
    // ----------------------------------------------------------------------------
    

    // ---------------------------category select----------------------------
    async function fetchCategory () {
      
        const { data, error } = await supabase.from('category').select('*');
        if (error) {
          console.error('Error fetching category:', error);
          return;
        }
        data.forEach(category=>{
          if(category.id===0){
            return
          }
          const option=document.createElement('option')
          option.append(category.name)
          selectCategory.appendChild(option)
        })
    } 
    selectCategory.addEventListener('onload',fetchCategory())
    // --------------------------------------------------------------------------------

    // -----------------------add book------------------------------
              
        const addBookForm = document.getElementById('add-book-form');
        if (addBookForm) {
          addBookForm.addEventListener('submit', async (event) => {
                  event.preventDefault();
      
                  const title = document.getElementById('title').value;
                  const description = document.getElementById('description').value;
                  const downloadLink = document.getElementById('download-link');
                  const imgLink = document.getElementById('img-link');
                  const Category=selectCategory.value;

                  if (!downloadLink.files.length || !imgLink.files.length){
                    Swal.fire({
                        title: `please select all file`,
                        icon: 'info', // success, error, info, warning, question
                        confirmButtonText: 'ok',
                      });
                      return;
                  };

                  let imgurl= await uploadFile(supabase,'imgs',imgLink)
                  let pdf=await uploadFile(supabase,'pdf',downloadLink)
                  insertData(supabase,'books','pdf',{title, description, download_link: pdf, img: imgurl ,categoryName:Category});
                  event.target.reset();
      
                
                }); 
          } else {
            console.error('Add book form not found!');}
              
          // ------------------remove book---------------------------------
        const removeBookForm = document.getElementById('remove-book-form');
      
        if (removeBookForm) {
                removeBookForm.addEventListener('submit', async (event) => {
                  event.preventDefault();
      
                  const title = document.getElementById('remove-title').value;
                  deleteData(supabase,'books','book','title',title,'imgs','img')
                  deleteData(supabase,'books','book','title',title,'pdf','download_link',true)
                  event.target.reset();
    
              
                }); 
          } else {
                console.error('Remove book form not found!');}
              
        
        // -------------------------add category--------------------------------
        
        const AddCategoryForm = document.getElementById('add-category-form');
        if (AddCategoryForm) {
                AddCategoryForm.addEventListener('submit', async (event) => {
                  event.preventDefault();
      
                  const name = document.getElementById('category-name').value;
                  insertData(supabase,'category','category',{name})
                  event.target.reset();
          });
        }
    
          // --------------------------remove category--------------------------------
    
          
        const removeCategoryForm = document.getElementById('remove-category-form');
      
              if (removeCategoryForm) {
                removeCategoryForm.addEventListener('submit', async (event) => {
                  event.preventDefault();
      
                  const name = document.getElementById('category-remove-name').value;
                  deleteData(supabase,'category','category','name',name,false,false,true)
                  event.target.reset();
                  
                });
              } else {
                console.error('Remove category form not found!');}
        // --------------------------------------------------------------------------------------


    
    // Format date
    function formatDate(dateString) {
        const options = { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Render message list
     function renderMessages(filteredMessages = messages) {
        if(messageList){
            messageList.innerHTML = filteredMessages.map(message => `
                <div class="message-item ${message.unread ? 'unread' : ''}" data-id="${message.id}">
                    <div class="message-header">
                        <span class="message-sender">${message.name}</span>
                        <span class="message-date">${formatDate(message.date)}</span>
                    </div>
                    <div class="message-preview">${message.message}</div>
                </div>
            `).join('');
        }

        // Add click event listeners to message items
        document.querySelectorAll('.message-item').forEach(item => {
            item.addEventListener('click', async () => {
                const messageId = parseInt(item.dataset.id);
                showMessageDetail(messageId);
                if (item.classList.contains('unread')){
                    item.classList.remove('unread');
                    updateData(supabase,'usersmessages',['id',messageId],{'unread':'False'});
                    
                    await wait(2000);
                    messages= await  fetchdata(supabase,'usersmessages','messages',true,true,'.messages-container');
                    filtering(messages);
                    
                    

                    
                }
            });
        });
    }

    // Show message detail
    function showMessageDetail(messageId) {
        const message = messages.find(m => m.id === messageId);
        if (!message) return;

        messageDetail.classList.add('active');
        messageDetail.querySelector('.detail-content').innerHTML = `
            <div class="detail-field">
                <label>From</label>
                <p>${message.name} (${message.email})</p>
            </div>
            <div class="detail-field">
                <label>Date</label>
                <p>${formatDate(message.date)}</p>
            </div>
            <div class="detail-field">
                <label>Message</label>
                <p>${message.message}</p>
            </div>
            <div class="mt-4">
                <button class="btn btn-outline-danger" onclick="deleteMessage(${message.id})">Delete</button>
            </div>
        `;
    }

    // Close detail view
    if(document.getElementById('closeDetail')){
        document.getElementById('closeDetail').addEventListener('click', () => {
            messageDetail.classList.remove('active');
        });
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredMessages = messages.filter(message => 
            message.name.toLowerCase().includes(searchTerm) ||
            message.message.toLowerCase().includes(searchTerm) ||
            message.email.toLowerCase().includes(searchTerm)
        );
        renderMessages(filteredMessages);
    });

    // Filter functionality

    filterButtons.forEach(button => {
        button.addEventListener('change', (e) => {
            const filterValue = e.target.id;
            let filteredMessagesT = messages;

            if (filterValue === 'unread') {
                filteredMessagesT = messages.filter(m => m.unread);
            
             } 

            renderMessages(filteredMessagesT);
        });
    });
    function filtering(messages){
        
        let filteredMessages = messages;
        filteredMessages = messages.filter(m => m.unread);
        renderMessages(filteredMessages);
    };

    
    // Initial render
    renderMessages();
    


    // Placeholder functions for delete
    

    window.deleteMessage = async function(messageId) {
        if (confirm('Are you sure you want to delete this message?')) {
            deleteData(supabase,'usersmessages','message','id',messageId)
            await wait(2000)
            messages= await fetchdata(supabase,'usersmessages','messages',true,true,'.messages-container')
            renderMessages(messages);
            messageDetail.classList.remove('active');
        }
    };
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
});


