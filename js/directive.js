angular.module("app")
.directive('autoComplite', function($timeout){
    //функция для экранирования спец.симв.
    RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    //массив функций по keyCode нажатой кнопки
    var KEYS={
        //escape
        "27":function(scope,element){
                scope.output=[];
                scope.popularItems=[];
        },
        //enter
        "13":function(scope,element){
                //ищет выбранный элемент
                var elementById = element[0].getElementsByClassName('autocomplite-selected');
                if(elementById.length){
                    var elementResult=angular.element(elementById);
                    //триггерит событие click на выбранном элементе
                    $timeout(function(){                        
                        elementResult.triggerHandler('click');                        
                    }).then(()=>{
                        //фокусировка на следующем элементе
                        scope.elemInput[0].blur();
                    })                    
                }
                
        },
        //down
        "40":function(scope,element){
                var elementResult;
                //ищет текущий выбранный элемент
                var elementById = angular.element(element[0].getElementsByClassName('autocomplite-selected'));
                //если никакой элемент не выбран то находит первый из списка выведенных
                elementById[0]?elementResult=elementById
                :elementResult=element.find('li').eq(0);
                if(elementResult.length){
                    if(elementResult.hasClass('autocomplite-selected')){
                        //находит следующий элемент,если он есть
                        var next=elementResult.next();
                        if(!next[0]){return}
                        //устанавливает класс следующему элементу
                        next.addClass('autocomplite-selected');
                        elementResult.removeClass('autocomplite-selected');
                    }
                    else{
                        elementResult.addClass('autocomplite-selected');
                    }
                }
        },
        //up
        "38":function(scope,element){
                //ищет текущий выбранный элемент
                var elementById = angular.element(element[0].getElementsByClassName('autocomplite-selected'));
                //если никакой не выбран до находит последний из списка выведеннх
                elementById[0]?elementResult=elementById
                :elementResult=angular.element(element.find('ul')[0].lastElementChild);
                if(elementResult.length){
                    if(elementResult.hasClass('autocomplite-selected')){
                        //находит предыдущий элемент, если он есть
                        var prev=angular.element(elementResult[0].previousElementSibling);
                        if(!prev[0]){return}
                        //устанавливает класс предыдущему элементу
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
            settings:"="//настройки директивы из контроллера
        },
        restrict:"A",
        templateUrl:"directiveTpl",
        link: function(scope, element, attrs){
            console.log("directive:",scope.settings);
            scope.output;//список подсказок
            scope.popularItems;//список популярных записей
            var elemInput=element.find('input');//поле ввода
            scope.elemInput=elemInput;
            scope.limitCount=scope.settings.limitCount;//количество записей в списке подсказок
            scope.uploadCard=scope.settings.uploadCard;//возможность добавление карточки


            //изменение input
            scope.inputChanged= function(){
                elemInput.parent().removeClass('notfound');
                if(!scope.input){
                    //если input пуст,то открыть список популярных записей
                    scope.output=[];
                    scope.popularItems=scope.settings.popularItem;
                    return;
                    
                }
                scope.popularItems=[];
                var regexp;
                //экранирование введеных данных
                var searchString=RegExp.escape(scope.input);
                //в зависимости от настроек поиск будет по вхождениям или нет.
                scope.settings.searchForIncluding
                ?regexp= new RegExp(searchString,"gi")
                :regexp= new RegExp('^'+searchString,"gi");
                scope.output=_.filter(scope.settings.data,function(item){
                     return item.City.search(regexp)!=-1;
                })
                if (scope.input && !scope.output.length){
                    //если свпадений не найдено то сработает предупреждение
                    scope.notFoundItem();
                }
            }
            //навигация по клавишам
            scope.keyUp= function(event){
                var key = event.keyCode;
                //выбор функции взависимости от keyCode
                var func=KEYS[key];
                if(func){
                    func(scope,element);
                }
            }
            //добавление значения из списка подсказок
            scope.addValue = function(item){
                scope.input=item.City;
                elemInput.prop('value',item.City);
                //scope.onBlur();
                
            }
            //фокус на input
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
            //список подсказок пуст
            scope.notFoundItem= function(){
                console.log('not-found-item');
                elemInput.parent().addClass('notfound');
            }
            //введено неверное значение
            scope.notFoundItemError= function(){
                console.log('not-found-item-error');
                elemInput.parent().removeClass('notfound');
                elemInput.parent().addClass('notfound-error');
            }
            //событие blur input
            scope.onBlur= function(isFieldСomplite){
                setTimeout(function(){
                //setTimeout используется потому что:
                //при выборе из списка подсказок, при нажатии мышкой
                //событие blur inputa отрабатывает первее
                //события click на элементе списка, вследствии - запись не проходит
                //В данной ситации решил пирлепиь костыль.
                if(scope.input&&isFieldСomplite){
                   var searchString=RegExp.escape(scope.input);
                   var regexp= new RegExp(searchString,"gi");
                   var item= _.find(scope.output,function(i){
                        return i.City.search(regexp)!=-1;
                   });
                   if(item){
                        scope.addValue(item);
                   }
                   else{
                        var popularItem= _.find(scope.popularItems,function(i){
                        return i.City.search(regexp)!=-1;
                        });
                        if(!popularItem){
                        scope.notFoundItemError();
                        }
                   }
                }
                scope.$apply(function(){
                scope.output=[];
                scope.popularItems=[];
                })
                element.next('input')[0].focus();
                },150)
           
            }
        }

    };

})