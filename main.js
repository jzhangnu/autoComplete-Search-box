console.log('start');

var selected = null;
var timeoutid = null;
var $searchInput = $('#search-input');
var $autoList = $('#list');

$searchInput.attr('autocomplete','off');

var clear = function(){
  $autoList.empty().hide();
};
//clear

$searchInput.blur(function(){
  setTimeout(clear,100);
});
//blur

$searchInput.keyup(function(e){
    if(e.keyCode > 40 || e.keyCode == 8 || e.keyCode == 32) {
      $autoList.empty().hide();
      clearTimeout(timeoutid);
      timeoutid = setTimeout(getData,300);
    }
    else if(e.keyCode == 38){
      //up
      if(selected == -1){
        setSelected($autoList.find('div').length - 1);
      }
      else {
        setSelected(selected - 1);
      }
    }
    else{
      setSelected(selected + 1);
    }
    //if
    e.preventDefault();
  })
  .keypress(function(e){
    //enter
    if(e.keyCode == 13) {
      if($autoList.find('div').length == 0 || selected == -1) {
        return;
      }
      $searchInput.val($autoList.find('div').eq(selected).text());
      $autoList.empty().hide();
      e.preventDefault();
    }
  })
//searchInput event signed

var setSelected = function(item){
  selectedItem = item ;
  //按上下键是循环显示的，小于0就置成最大的值，大于最大值就置成0
  if(selected < 0){
    selected = $autoList.find('div').length - 1;
  }
  else if(selected > $autoList.find('div').length-1 ) {
    selected = 0;
  };

  $autoList.find('div').removeClass('highlight')
  .eq(selected).addClass('highlight');
};
//func setSelected

var getData = function(){
  var str = $searchInput.val();
  console.log(str);

  $.get("https://api.viki.io/v4/search.json?c=" + str + "&per_page=5&with_people=true&app=100266a&t=1440586215",
    function(data){
      console.log(data);

      if(data.length){
        data = data.slice(0,6);
        //Limit the item amount

        $.each(data, function(index, item){
          var name = item.tt;
          var img = item.i;

          var item = $('<div></div>');

          item.text(name).appendTo($autoList)
            .hover(function(){
              $(this).siblings().removeClass('highlight');
              $(this).addClass('highlight');
              selectedItem = index;
            },
            function(){
              $(this).removeClass('highlight');
              selectedItem = -1;
            }
          )
          //hover
          .click(function(){
            $searchInput.val($autoList.find('div').eq(selected).text());
            $autoList.empty().hide();

          })
          //click

          $('<img>').attr('src',img).appendTo(item);
          //Added img

        })
        //Item event signed
      }
      //if
    })
    //get
    setSelected(0);
    //Initializing the list
    $autoList.show();
}
//func getData
