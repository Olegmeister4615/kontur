angular.module('app')
.controller("mainCtrl",function($scope, mainFactory, $rootScope){
    $scope.items;
    //когда записи будут загружены они добавятся в settings
    $rootScope.$on('items:loaded',function(){
        $scope.items=mainFactory.getItems();
        $scope.settings.data=$scope.items;
    })
    $scope.popularItems=mainFactory.getPopularItems();
    $scope.settings={
        data: $scope.items,//все записи
        popularItem: $scope.popularItems,//популярные записи
        searchForIncluding: true,//поиск по вхождениям
        limitCount:5 //максимальное количство всплывающих подсказок
    }
})