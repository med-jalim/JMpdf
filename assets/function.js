// ------------------------------------header--------------------------


export function loadHeader(){
    fetch('index.html')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const header = doc.querySelector('header');

            const headerLinks=doc.querySelectorAll('.headerLink')
            hoverLikn(headerLinks)

            document.getElementById('header-placeholder').appendChild(header);
        })
        .catch(error => console.error('Error loading header:', error));

}
 function hoverLikn(links){
  links.forEach(link=>{
    link.classList.remove('active')
    if (link.getAttribute('href')===window.location.pathname.replace('/','')){
        link.classList.add('active')
    }
})
}

// ---------------------------------------fetch function-------------------------
export async function fetchdata(supabase,table,message='book',displayALL=true,rutData=false,conteainer=undefined,eq=['','']){
  const { data: mydata, error } = await supabase
                .from(table)
                .select('*')
                .eq(eq[0], eq[1]);
                
            if (error) {
                console.error(`Error fetching ${message}:`, error);
                return;
            };

            if(rutData===false){
              displayALL===true ? displayBooks(mydata):displayBooks(displayALL);
              const bookList = document.getElementById('book-list');
              if (mydata.length===0 || (displayALL!==true&&displayALL.length===0)){
                  bookList.innerHTML=`
                      <div class='alert alert-info' >we're sorry there is no ${message}</div>
                  `
                  bookList.classList.remove('book-list')
                  return
              }else{
                bookList.classList.add('book-list')
              };
            }else{
              if (mydata.length===0){
                const div=document.querySelector(conteainer)
                div.innerHTML=`
                      <div class='alert alert-info m-0' >no ${message} here</div>
                  `
              }
              return mydata
            }        
}

export function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // تفريغ المحتوى الحالي
  
    books.forEach(book => {
      const bookItem = document.createElement('div');
      bookItem.classList.add('book-item','bg-light','mb-2');
  
      bookItem.innerHTML = `
      <a class="nav-link" href='booksInfo.html?title=${encodeURIComponent(book.title)}'>
            <div class="book-img"><img src="${book.img}" alt=""></div>
            <div class="book-info">
            <h6>${book.title}</h6>
            <a href="${book.download_link}" class="text-center nav-link text-primary" target="_blank">Download</a>
            </div>
        </a>
      `;
  
      bookList.appendChild(bookItem);
    });
  };


  // -------------------------insert function----------------
  export async function insertData(supabase,table,message=true,data){
    if (message!==true){
      Swal.fire({
        title: 'we are trying to insert data',
        text: 'wait.....',
        allowOutsideClick: false, // منع الإغلاق بالنقر خارج التنبيه
        didOpen: () => {
          Swal.showLoading(); // يعرض أيقونة التحميل
        }
      });

    }
    
      try {
        const { data:result, error } = await supabase
          .from(table)
          .insert(data);

        if (error) {
          if (error.code === '23505') {  // 23505 هو رمز الخطأ القياسي لانتهاك القيد الفريد في PostgreSQL
            if (message===true){
              console.error(`Error adding in insertdata function:`, error);
            }else{
              console.error(`Error adding ${message}:`, error);
              Swal.close();
              Swal.fire({
                title: `The ${message} already exists. Please use a different title.`,
                icon: 'info', // success, error, info, warning, question
                confirmButtonText: 'ok',
              });
            }
           
            
          } else {
             if (message===true){
              console.error(`Error adding in insertdata function :`, error);
             }else{
              console.error(`Error adding ${message}:`, error);
              Swal.close();
              Swal.fire({
                title: `Failed to add ${message} .`,
                icon: 'error', // success, error, info, warning, question
                confirmButtonText: 'ok',
              });
            }
             }
            
        } else {
          if (message===true){
            null
          }else{
            Swal.close();
            Swal.fire({
              title: `${message} added successfully!`,
              icon: 'success', // success, error, info, warning, question
              confirmButtonText: 'ok',
            });
          }
          
          
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred.');
      }
  };

  // ----------------------------------delet function--------------------

  export async function deleteData(supabase,table,message,columnName,value,bucket=false,ColumnFile=false,showAlert=false){
    if(showAlert!==false){
      Swal.fire({
        title: 'we are trying to delet data',
        text: 'wait.....',
        allowOutsideClick: false, // منع الإغلاق بالنقر خارج التنبيه
        didOpen: () => {
          Swal.showLoading(); // يعرض أيقونة التحميل
        }
      });
    }
    try {
      const { data, error } = await supabase
        .from(table)
        .select()
        .eq(columnName, value);
        
      if(data.length!==0 && bucket!==false && ColumnFile!==false){
        const filePath = decodeURIComponent(data[0][ColumnFile].split(`${bucket}/`)[1]); // استخراج مسار الملف

        if (filePath) {
          // حذف الملف من التخزين
          const { error: deleteFileError } = await supabase.storage
            .from(bucket)
            .remove(filePath);
  
          if (deleteFileError) {
            console.error("Error deleting file:", deleteFileError.message);
            return;
          };
      };
    };
        
      if (data.length===0){
        if (showAlert!==false){
          Swal.close();
          Swal.fire({
            title: `there is no ${message} with this title`,
            icon: 'error', // success, error, info, warning, question
            confirmButtonText: 'ok',
          });
        }
        
      }
      else if (error) {
        console.error(`Error deleting ${message}:`, error);
        if (showAlert!==false){
          Swal.close();
          Swal.fire({
            title: `Failed to delete ${message}.`,
            icon: 'error', // success, error, info, warning, question
            confirmButtonText: 'ok',
          });
        }
      } else {
        const { data, error } = await supabase
        .from(table)
        .delete()
        .eq(columnName, value);
        if (error){
          console.log(`erorr:`,error)
          if (showAlert!==false){
            Swal.close();
            Swal.fire({
              title: `Failed to delete ${message}.`,
              icon: 'error', // success, error, info, warning, question
              confirmButtonText: 'ok',
            });
          }
        }else{
          if (showAlert!==false){
            Swal.close();
            Swal.fire({
              title: `${message} removed successfully!`,
              icon: 'success', // success, error, info, warning, question
              confirmButtonText: 'ok',
            });
          }
      }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      if (showAlert!==false){
        Swal.close();
        Swal.fire({
          title: `Unexpected error: ${err}.`,
          icon: 'error', // success, error, info, warning, question
          confirmButtonText: 'ok',
        });
    };
  };
};


  // ---------------------------------update function------------------------

  export async function updateData(supabase,table,eq=[], dataUpdated) {
    const { data, error } = await supabase
      .from(table) // اسم الجدول الذي تريد تحديثه
      .update(dataUpdated) // العمود الذي تريد تحديثه
      .eq(eq[0], eq[1]); // شرط لتحديد السجل الذي سيتم تحديثه بناءً على الـ ID
  
    if (error) {
      console.error('Error updating :', error);
    } else {
      console.log(' updated successfully');
    }
  }


  // ------------------upload file function-------------------------------------
  export async function uploadFile(supabase,bucket,FileInput){
    Swal.fire({
      title: 'we are trying to insert data',
      text: 'wait.....',
      allowOutsideClick: false, // منع الإغلاق بالنقر خارج التنبيه
      didOpen: () => {
        Swal.showLoading(); // يعرض أيقونة التحميل
      }
    });
    const fileInput = FileInput;
    const file = fileInput.files[0];
  
    if (!file) {
      Swal.close();
      Swal.fire({
        title: `please select all file`,
        icon: 'info', // success, error, info, warning, question
        confirmButtonText: 'ok',
      });
      return;
    }
  
    // اسم الملف المميز (يمكنك استخدام uuid أو timestamp)
    const fileName = encodeURIComponent(file.name).replace(/%/g,'');
    const fileCheck=await fileExists(supabase,bucket,fileName);
    if(fileCheck!==false){
      Swal.close();
      return fileCheck;
    }
  
    try {
      const { data, error } = await supabase.storage
        .from(bucket) // اسم الـ bucket
        .upload(fileName, file);
  
      if (error) {
        console.error('Error uploading file:', error);
        Swal.close();
        Swal.fire({
          title: `Failed to upload file.`,
          icon: 'error', // success, error, info, warning, question
          confirmButtonText: 'ok',
        });
        return;
      }
  
    //   // عرض الرابط المؤقت أو حفظه في قاعدة البيانات
      const Url = supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl;
      Swal.close();
      return Url
    } catch (err) {
      console.error('Unexpected error:', err);
      Swal.close();
    }
  }



async function fileExists(supabase,bucket,fileName) {
  const { data, error } = await supabase.storage
        .from(bucket) // اسم الـ bucket
        .list();
  if (error){
      console.log(`error in fileExists:${error} `)  
        };

  const file = data.find((file) => file.name === fileName);

  if (file) {
          // إذا تم العثور على الملف، إنشاء رابط عام له
    const Url  = supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl;
          return Url; // إرجاع الرابط
    } else {
          return false; // إذا لم يتم العثور على الملف
        }
      
};
  

 
  