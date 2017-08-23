angular.module("app").factory('mainFactory', function($http,$rootScope){
var items;
$http.get("/prod/data/kladr.json")//получение данных
.success(function(data){

    items=data;
}).error((err)=>{
    console.log('not load:',err)
}).then(()=>{
    $rootScope.$emit('items:loaded');
});
var popularItems=[ //популярные записи
  {
    "Id": 0,
    "City": "г. Белинский"
  },
  {
    "Id": 1,
    "City": "г. Каменка"
  },
  {
    "Id": 2,
    "City": "ЗАТО п. Солнечный"
  },
  {
    "Id": 3,
    "City": "р.п. Тамала"
  }
];
return{
    getItems: function(){
        return items;
    },
    getPopularItems: function(){
        return popularItems
    }
}

})