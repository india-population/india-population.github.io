/*(function(w) {
  console.log(w);
})(window);

(function() {
  console.log("test");
})();
*/


$("body").on("click", "#checkbox", function() {
  if (this.checked) {
    var val = this.value;
    Lines.forEach(function(a) {
     if (a[0] == val) {
       $.publish('line.'+val, [a[0], a[1]]);
     } 
    });
  }
  else {
    $.publish('line.'+this.value, [this.value]);
  }
});

(function(d) {

  var cache = {};

  d.publish = function(/* String */topic, /* Array? */args) {
    try{
      d.each(cache[topic], function(){
        this.apply(d, args || []);
      });
    }
    catch (err) {
      // handle this error
      console.log(err);
    }
  };

  d.subscribe = function(/* String */topic, /* Function */callback) {
    if(!cache[topic]){
      cache[topic] = [];
    }
    cache[topic].push(callback);
      return [topic, callback]; // Array
  };
  
  d.unsubscribe = function(/* Array */handle) {
    var t = handle[0];
    cache[t] && d.each(cache[t], function(idx){
      if(this == handle[1]){
        cache[t].splice(idx, 1);
      }
    });
  };
  
})(jQuery);

var index = {};

//Initialize subscribers
(Lines.forEach(function(a) {
  var b = a[0];
  $.subscribe('line.'+a[0],  function (a , b) {
    //console.log(a)
    if(b) {
      options.data.push(b);
      $("#chartContainer").CanvasJSChart(options);
      index[a] = options.data.length;
      //console.log(index);
    }
    else {
      t = index[a] - 1;
      options.data.splice(t, 1);
       $("#chartContainer").CanvasJSChart(options);
    }
  });
}));

//Better to construct options first and then pass it as a parameter
var options = {
  title: {
	  text: "Population in India"
	},
  
  axisX:{      
    valueFormatString: "YYYY" 
  },
  animationEnabled: true,
		data: []
};

