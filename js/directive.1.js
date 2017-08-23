angular.module("app")
.directive('autoComplite', function($timeout){
    var KEYS={
        "27":function(scope,element){//escape
                scope.output=[];
                scope.popularItems=[];
        },
        "13":function(scope,element){//enter
                var elementById = element[0].getElementsByClassName('autocomplite-selected');
                console.log(elementById);
                if(elementById.length){
                    var elementResult=angular.element(elementById);
                    $timeout(function(){
                        elementResult.triggerHandler('click');
                        
                    }).then(()=>scope.elemInput[0].blur())                    
                }
        },
        "40":function(scope,element){//down
                var elementResult;
                var elementById = angular.element(element[0].getElementsByClassName('autocomplite-selected'));
                elementById[0]?elementResult=elementById
                :elementResult=element.find('li').eq(0);
                console.log('keyUp:',elementResult);
                if(elementResult.length){
                    if(elementResult.hasClass('autocomplite-selected')){
                        var next=elementResult.next();
                        if(!next[0]){return}
                        next.addClass('autocomplite-selected');
                        elementResult.removeClass('autocomplite-selected');
                    }
                    else{
                        elementResult.addClass('autocomplite-selected');
                    }
                }
        },
        "38":function(scope,element){//up
                var elementById = angular.element(element[0].getElementsByClassName('autocomplite-selected'));
                elementById[0]?elementResult=elementById
                :elementResult=angular.element(element.find('ul')[0].lastElementChild);
                console.log('keyUp:',elementResult);
                if(elementResult.length){
                    if(elementResult.hasClass('autocomplite-selected')){
                        var prev=angular.element(elementResult[0].previousElementSibling);
                        if(!prev[0]){return}
                        prev.addClass('autocomplite-selected');
                        elementResult.removeClass('autocomplite-selected');
                    }
                    else{
                        elementResult.addClass('autocomplite-selected');
                    }
                }
        }
    };
    
    
    return {
        scope:{
            settings:"="
        },
        restrict:"A",
        templateUrl:"directiveTpl",
        link: function(scope, element, attrs){
            var elemInput=element.find('input');
            scope.elemInput=elemInput;
            
            console.log(elemInput);


            console.log("directive:",scope.settings);
            scope.inputChanged= function(){
                console.log('inputChanged');
                elemInput.parent().removeClass('notfound');
                
                if(!scope.input){
                    scope.output=[];
                    scope.popularItems=scope.settings.popularItem;
                    return;
                    
                }
                scope.popularItems=[];
                var regexp;
                scope.settings.searchForIncluding
                ?regexp= new RegExp(scope.input,"gi")
                :regexp= new RegExp('^'+scope.input,"gi");
                scope.output=_.filter(scope.settings.data,function(item){
                     return item.City.search(regexp)!=-1;
                })
                console.log('inputCange:',scope.input,scope.output);
                if (scope.input && !scope.output.length){
                    scope.notFoundItem();
                }
            }
            scope.keyUp= function(event){
                console.log('keyUp');
                console.log('keyUp:',event);
                var key = event.keyCode;
                var func=KEYS[key];
                if(func){
                    func(scope,element);
                }
            }
            scope.addValue = function(item){
                console.log('addValue');
                console.log(item);
                scope.input=item.City;
                elemInput.prop('value',item.City);
                scope.popularItems=[];
                //elemInput[0].blur();
            }
            scope.onFocus= function(){
                console.log('onFocus');
                elemInput[0].select();
                elemInput.parent().removeClass('notfound-error');
                if(scope.input){
                   scope.inputChanged();
                   return; 
                }
                scope.popularItems=scope.settings.popularItem;
                
            }
            scope.notFoundItem= function(){
                console.log('not-found-item');
                elemInput.parent().addClass('notfound');
            }
            scope.notFoundItemError= function(){
                console.log('not-found-item-error');
                elemInput.parent().removeClass('notfound');
                elemInput.parent().addClass('notfound-error');
            }
            scope.onBlur= function(){
                console.log('bluuur');
                console.log(scope.input);
                if(scope.input){
                   var regexp= new RegExp(scope.input,"gi");
                   var item= _.find(scope.output,function(i){
                        return i.City.search(regexp)!=-1;
                   });
                   if(item){
                        scope.addValue(item);
                   }
                   else{
                        scope.notFoundItemError();
                   }
                   
                }
                scope.output=[];
                

            }
            



        }

    };

})