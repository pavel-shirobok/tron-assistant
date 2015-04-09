angular
    .module('DialogManager', [])
    .service('DialogManager', function($q, $http){
        var STANDBY = 0x00FF00;
        var LOADING = 0x0000FF;
        var SPEAKING = 0xFF0000;
        var LISTEN = 0xFFFF00;

        var self = this;
        this.start = function(){
            annyang.debug(true);
            annyang.setLanguage('ru-RU');
            annyang.start({ autoRestart: true, continuous: true });
            setReadyState();
        };


        function setReadyState() {
            animate('standby', STANDBY);
            annyang.removeCommands();

            annyang.addCommands({
                "проснись" : function(){
                    say('Слушаю вас!').then(function(){ setCommandState(); });
                }
            })
        }

        function setCommandState() {
            animate('listen', LISTEN);
            var commandTimeout = setTimeout(function(){
                clearTimeout(commandTimeout);
                commandTimeout = -1;
                setReadyState();
            }, 10000);
            function stopTimeout() {
                if(commandTimeout != -1) {
                    clearTimeout(commandTimeout);
                    commandTimeout = -1;
                }
            }


            annyang.removeCommands();

            annyang.addCommands({
                "погода" : function(){
                    stopTimeout();

                    animate('loading', LOADING);

                    $http.get('/weather')
                        .then(function(json){

                            var town = json.data.list[0].name;
                            var temp = json.data.list[0].main.temp;
                            say('Сейчас в  Красноярске ' + ('' + temp).replace('.', ',') + ' градусов').then(function(){
                                setReadyState();
                            });
                        });
                },
                "говна пакет" : function() {
                    stopTimeout();
                    say('Пидора ответ').then(setReadyState)
                },
                "курс доллара" : function() {
                    stopTimeout();
                    if(Math.random() < 0.666) {

                        $http.get('https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22USDRUB%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=')
                            .then(function(data){
                                var currency = data.data.query.results.rate.Rate;
                                currency = currency.split('.');
                                var rub = currency[0];
                                var kop = currency[1].substr(0, 2);


                                var last = parseInt(kop[1]);
                                var kops = ['копеек', 'копейка', 'копейки', 'копейки', 'копейки','копеек','копеек','копеек','копеек', 'копеек'];

                                say('Курс доллара на данный момент ' + rub  + ' рублей и ' + kop + ' ' + kops[last]).then(setReadyState);
                            });

                    }else {
                        say('У тебя столько нет').then(setReadyState)
                    }


                },
                "покажи (мне) *q" : function(query) {
                    stopTimeout();
                    console.log('test');
                    animate('loading', LOADING);
                    queryPic(query).then(function(url){
                        say('Картинки по запросу: ' + query);
                        showImage(url);
                        setReadyState();
                        setTimeout(showImage, 5000);
                    });

                },
                "расскажи :type" : function(query) {
                    stopTimeout();
                    //var query = 'анекдот';
                    var types = {'анекдот' : [1, 11], 'стих' : [3, 12], 'стишок' : [3, 12], 'афоризм' :[4, 14]};
                    query = query.toLowerCase();
                    //say('Жена - мужу Васе:. . - Настроение должно быть такое, чтобы в ванной хотелось петь!. . - Каких ещё Петь?!');
                    //say('Жена - мужу Васе:. . - Настроение должно быть такое, чтобы в ванной хотелось петь!. . - Каких ещё Петь?!');


                    if(types[query]){
                        var type = types[query][Math.floor(types[query].length * Math.random())];
                        $http.get('/fun/' + type, {
                            transformResponse:function(data) {
                                data = data.replace('{"content":"', '');
                                data = data.substr(0, data.length-2);
                                data = data.replace(/(\r|\n| )/g, ' ');
                                return data;
                            }
                        })
                            .then(function(data){
                                console.log(data);
                                say(data.data).then(setReadyState)
                            })
                    }else{
                        say('Ничего не расскажу про ' + query).then(setReadyState)
                    }
                }
            });
        }

        function confirmState() {
            annyang.removeCommands();
        }

        function say(phrase, lang) {
            return $q(function(resolve){
                $('body').append(
                    $('<iframe>').attr({
                        src : "https://translate.google.com/translate_tts?tl=" + (lang?lang.toUpperCase():'RU') + "&q=" + encodeURIComponent(phrase)
                    }).css({
                        'display' : 'none'
                    }).bind('load', function(){
                        animate('speaking', SPEAKING);
                        setTimeout(function(){
                            animate('standby', STANDBY);
                            resolve();
                        }, phrase.length / 3 * 250)
                    })
                );
            });
        }

        function animate(name, color) {
            if(self.animate)self.animate(name, color);
        }

        function showImage(img){
            setTimeout(function(){if(self.showImage)self.showImage(img)});
        }

        function queryPic(query) {
            return $q(function(resolve){
                var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=a828a6571bb4f0ff8890f7a386d61975&sort=interestingness-desc&per_page=9&format=json&callback=jsonFlickrApi&text=';
                url += encodeURIComponent(query);

                $.ajax({
                    type: 'GET',
                    url: url,
                    async: false,
                    jsonpCallback: 'jsonFlickrApi',
                    contentType: "application/json",
                    dataType: 'jsonp',
                    success : function(results) {
                        if(results.photos && results.photos.photo && results.photos.photo.length){
                            var photo = results.photos.photo[0];
                            var link = 'https://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'_b.jpg';
                            resolve(link);
                        }
                    }
                });

            })
        }


        //say('Жена  мужу Васе:. .  Настроение должно быть такое, чтобы в ванной хотелось петь!. .  Каких ещё Петь?!');
    });


/*var utterance = new SpeechSynthesisUtterance(phrase);
 var voices = speechSynthesis.getVoices();
 utterance.voice = voices[voices.length - 1];
 utterance.onend = function(){
 resolve();
 //alert('on end');
 };
 animate('speaking', SPEAKING);
 speechSynthesis.speak(utterance);*/