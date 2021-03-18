var config = {
    apiKey: "AIzaSyCOjKqimiUdlfx2k8Dwxcm_SYoB074lNE4",
    authDomain: "persona-polls.firebaseapp.com",
    databaseURL: "https://persona-polls.firebaseio.com/",
    storageBucket: "persona-polls.appspot.com"
  };
if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
var database = firebase.database();

function LetsDoThis(){
  let id, nama, doc;
  id = document.getElementById("id").value;
  nama = document.getElementById("nama").value;
  doc = document.querySelector("#utama");
  doc.innerHTML = `
  <div class="section"></div>
      <div class="container">
       <p class="right transt" id="nama">${nama}</p>
    </div>
  <div class="container">
  <div class="row" id="isianCalon"><div/></div>`
  ;
  loadData(id);
}
function loadData(nom){
  let tujuan = document.getElementById("isianCalon");
  database.ref(`data/${nom}`).once("value", function(a){
    let datanya = a.val();
    document.querySelector("header").innerHTML = `
    <h3 class="white-text">${datanya.desc}</h3>
  `;
  })
  let code = `data/${nom}/calon`;
  database.ref(code).once("value", function(a){
    let i;
    let datanya = a.val();
    for (i in datanya){
      let nama = datanya[i].nama;
      let foto = datanya[i].foto;
      let visi = datanya[i].visi;
      let misi = datanya[i].misi;

      let hfoto = foto.slice(12,);
      if (i%2 ==0){
        tujuan.innerHTML += `
      <div  class="calon white bordor col s12 m5 ">
      <a href="#modal${i}" class="modal-trigger">
      <img src="asset/img/${hfoto}" alt="" class="fotoCalon">
      </a>
        <div class="divider"></div>
        <p class="center">${nama}</p>
        <div class="divider"></div>
        <p class="center">VISI</p>
        <p class="center lighter">"${visi}"</p>
        <p class="center">MISI</p>
        <p class="center ligther">${misi}</p>
      </div>
      <div id="modal${i}" class="modal">
      <div class="modal-content">
        <h4>Kirim</h4>
        <p>Apakah anda yakin memilih ${nama} sebagai kandidat pilihan anda?</p>
      </div>
      <div class="modal-footer">
        <a  class="modal-close waves-effect waves-red btn-flat">Kembali</a>
        <a onclick="pilih(${i},'${nom}')" class="modal-close waves-effect waves-green green btn-flat">Benar</a>
      </div>
    </div>
      `;
      }else{
        tujuan.innerHTML += `
      <div  class="calon white bordor col s12 m5 offset-m2 ">
      <a href="#modal${i}" class="modal-trigger">
      <img src="asset/img/${hfoto}" alt="" class="fotoCalon">
      </a>
        <div class="divider"></div>
        <p class="center">${nama}</p>
        <div class="divider"></div>
        <p class="center">VISI</p>
        <p class="center lighter ">"${visi}"</p>
        <p class="center">MISI</p>
        <p class="center ligther ">${misi}</p>
      </div>
      <div id="modal${i}" class="modal">
      <div class="modal-content">
        <h4>Kirim</h4>
        <p>Apakah anda yakin memilih ${nama} sebagai kandidat pilihan anda?</p>
      </div>
      <div class="modal-footer">
        <a  class="modal-close waves-effect waves-red btn-flat">Kembali</a>
        <a onclick="pilih(${i},'${nom}')" class="modal-close waves-effect waves-green green btn-flat">Benar</a>
      </div>
    </div>
      `;
      }
    }
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {});
  })
}
function pilih(x, y){
  let data = document.getElementById("nama").innerHTML;
  let i= new Object();
  let date = new Date();
  i["waktu"] = {
    tanggal : date.getDate(),
    waktu : date.getHours(),
  } 
  database.ref(`data/${y}/pilihan/${x}/pemilih`).once("value", function(a){
    let k = a.val();
    if(k){
      k[k.length] = data;
    }
    else{
      k = new Object();
      k[0] = data;
    }
    database.ref(`data/${y}/pilihan/${x}/pemilih`).set(k);
  })
  document.querySelector("#utama").innerHTML = `
  <div class="section">
    <div class="container bordor white">
        <br>
        <br>
        <h1 class="center">Terimakasih</h1>
        <h3 class="center">Telah menggunakan hak pilih anda</h3>
        <div class="center">
            <a href="/realcount.html?id=${y}" class="btn red">Lihat Hasil</a>
        </div>
        <br>
        <br>
    </div>
</div>


  `
}
function AddCalon(){
  let htm = document.getElementById("datacalon");
  let num = htm.children.length /4;
  htm.innerHTML += `
  <div class="col s5 input-field">
                        <input type="text" id="nama${num}">
                        <label for="nama${num}">Nama Calon</label>
                    </div>
                    <div class="col s5">
                        <div class="file-field input-field">
                            <div class="btn">
                              <span>Foto</span>
                              <input id="foto${num}" type="file">
                            </div>
                            <div class="file-path-wrapper">
                              <input class="file-path validate" type="text">
                            </div>
                          </div>
                    </div>
                    <div class="col s1">
                        <a onclick="AddCalon()" class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">add</i></a>
                    </div> 
                    <div class="col s1">
                        <a onclick="RemoveCalon(${num})" class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">clear</i></a>
                    </div> `
}
function InputDataCalon(){
  let i;
  let kumpul = new Object();
  let calon = new Object();
  let id = document.getElementById("id").value;
  let num = document.getElementById("datacalon").children.length;
  kumpul["id"] = id;
  for(i=0;i<(num/4);i++){
    let name = document.getElementById(`nama${i}`).value;
    let fot = document.getElementById(`foto${i}`).value;
    calon[i] = {
      nama : name,
      foto : fot,
    }
  }
  kumpul["calon"] = calon;
  let masuk = `data/${id}`;
  database.ref(masuk).set(kumpul);
}
function checkNama(){
  let id = document.getElementById("id").value;
  let nama = document.getElementById("nama").value;
  database.ref(`/data/${id}`).once("value", function(e){
    let a = e.val();
    if(!a){
      M.toast({html: 'ID Tidak terdaftar', classes:'red'})
    }else if(id ==""){
      M.toast({html: 'ID Tidak boleh kosong', classes:'red'})
    }else{
      let startTime = new Date(a.startAt);
      let endTime = new Date(a.endAt);
      let timeNow = new Date();
      if(timeNow > endTime){
        M.toast({html: 'Polling Telah Berakhir', classes:'red'})
      }else if (timeNow < startTime){
        M.toast({html: 'Polling Belum Dibuka', classes:'red'})
      }else{
        database.ref(`/data/${id}/pilihan`).once("value", function(b){
          let k = b.val();
          let per = [];
          for(i in k){
            let datanya = k[i].pemilih;
            if(nama ==""){
              M.toast({html: 'Nama Tidak Boleh Kosong', classes:'red'})
              break;
            }
            for (j in datanya){
              per.push(datanya[j]);}}
            if(per.includes(nama)){
                M.toast({html: 'Nama Sudah digunakan', classes:'red'})
            }else if(nama != "" && !per.includes(nama)){
                LetsDoThis();
              }
        })
      }
    }

  })
}

function load(){
  let params = new URLSearchParams(window.location.search);
  let idParams = params.get("id");
  database.ref(`data/${idParams}/pilihan/`).on("value", function(a){
    let k = a.val();
    if(!k){
      window.open("404.html", "_self")
    }
    let the = [];
    let i;
    for(i in k){
      the.push([k[i].nama, k[i].pemilih.length-1]);
    }
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    let b = [['Nama', 'Pemilih']];
    let c = b.concat(the);
    var data = google.visualization.arrayToDataTable(c);

      var options = {
        title: `Real Count`,
        pieHole: 0.4,
        legend: {position:"bottom"},
      };

      var chart = new google.visualization.PieChart(document.getElementById('chart'));

      chart.draw(data, options);
    }
  })

}
function pantau(){
  let id = document.getElementById("id").value;
  let namagiat = document.getElementById("namaKegiatan");
  let utama = document.getElementById("utama");
  let stat = document.getElementById("stat");
  utama.innerHTML ="<br>";
  let k = [];
  if(id ==""){
    M.toast({html: 'ID Tidak Boleh Kosong', classes:'red'})
  }else{
    database.ref(`/data/${id}`).on("value", function(v){
      let count =0;
      let data = v.val();
      let penampung1 =``;
      if(!data){
        M.toast({html: 'ID Tidak Terdaftar', classes:'red'})
      }else{
        namagiat.innerHTML= data.desc;
        for(i in data.pilihan){
          for(j in data.pilihan[i].pemilih){
            if(j ==0){
              continue;
            }
            let tambah = data.pilihan[i].pemilih[j];
            console.log("tambah =", tambah)
            penampung1 +=`<p class="center">${tambah}</p>`
            count++;
          }
        }
        utama.innerHTML = penampung1;
        stat.innerHTML= `
        <div class="row">
        <div class="container _90">
              <div class="card section">
              <h5 class="center">Total Pemilih</h5><h4 class="center">${count}</h4></div>
          </div></div>
        `
      }
    })
  }
}
