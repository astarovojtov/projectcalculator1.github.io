// выбирать список элементов по классу, а потом привязывать к ним Event Listener не очень хорошо
// на практике класс на html странице может поменяться в будущем и JS код просто перестанет работать
// лучше использовать id, но если элементов много можно поставить html аттрибут data-*, например data-button
// HTML: <button data-button>Click me</button> 
//   JS:  document.querySelectorAll("[data-button]")
// Подробнее здесь: https://developer.mozilla.org/ru/docs/Web/Guide/HTML/Using_data_attributes

var numbers = document.querySelectorAll(".number"),
    operations = document.querySelectorAll(".operator"),
    clearBtns = document.querySelectorAll(".clear-btn"),
    decimalBtn = document.getElementById("decimal"),
    result = document.getElementById("result"),
    display = document.getElementById("display"),
// обычно названия переменных начинаются с маленькой буквы
// с заглавной буквы обозначают классы или функции конструкторы
// имена констант пишут все заглавные пример MY_COOL_CONSTANT
// работать будет, но лучше не делать как здесь
    MemoryCurrentNumber = 0, 
    MemoryNewNumber = false, 
    MemoryPendingOperation = "";

// Для информации. Добавлять обработчик событий на HTML элемент можно так же в самом HTML
// <button value="Click" onclick="numberPress(event)">
// http://htmlbook.ru/html/attr/onclick

for(var i = 0; i < numbers.length; i++) {
    var number = numbers[i];
    number.addEventListener("click", function(e){
        numberPress(e.target.textContent);
    });
};

for(var i = 0; i < operations.length; i++) {
    var operationBtn = operations[i];
    operationBtn.addEventListener("click", function(e){
        operationPress(e.target.textContent);
    });
};

// В ролике автор сказал, что нельзя в данном случае получить объект события, если записать так:
// for(var i = 0; i < operations.length; i++) {
//     var operationBtn = operations[i];
//     operationBtn.addEventListener("click", operationPress);
// };
// На самом деле можно

for(var i = 0; i < clearBtns.length; i++) {
    var clearBtn = clearBtns[i];
    clearBtn.addEventListener("click", function(e){
    // в видео автор использует e.srcElement.id, чтобы определить по какой из кнопок кликнул пользователь
    // здесь почему-то уже e.target.textContent
    // используют, как правило, e.target. А e.srcElement - нестандартный способ получить тот же e.target для Internet Explorer
    // так же можно использовать просто this.id или this.textContent
    clear(e.target.textContent);
    });
};

decimalBtn.addEventListener("click", decimal);

result.addEventListener("click", function(e){
    console.log("Клик по result")
});

// Ниже пример плохого форматирования кода

// Автор ни слова не сказал про то, почему функции объявлены в конце файла, а используются после их объявления
// Что будет если записать их так: var numberPress = function(number) { ...идентичный код } ??
    function numberPress(number) {
        if(MemoryNewNumber) {
            display.value = number;
            MemoryNewNumber = false;
        } else {
            if(display.value === "0") {
                display.value = number;
            } else {
                display.value += number;
            };
        };
    };

function operationPress(op) {
        localOperationMemory = display.value;
        
        if(MemoryNewNumber && MemoryPendingOperation !== "=") {
            display.value = MemoryCurrentNumber;
        } else {
            MemoryNewNumber = true;
            if (MemoryPendingOperation === "+") {
                // В видео автор использовал parseFloat(localOperationMemory), 
                // чтобы привести к числу строковое значение, которое ввел пользователь
                // операция +localOpertaionMemory будет работать схоже с parseFloat(localOperationMemory)
                // однако результат выражения var myString = "число"; myString += +localOperationMemory будет строкой прим. "число123"
                MemoryCurrentNumber += +localOperationMemory;  
            } else if (MemoryPendingOperation === "-") {
                MemoryCurrentNumber -= +localOperationMemory;  
            } else if (MemoryPendingOperation === "*") {
                MemoryCurrentNumber *= +localOperationMemory;  
            } else if (MemoryPendingOperation === "/") {
                MemoryCurrentNumber /= +localOperationMemory;  
            } else {
                MemoryCurrentNumber = +localOperationMemory;  
            }
            
            // Длинные деревья if () {} else if () {} else {} удобнее писать конструкцией switch () { case: }
            // https://learn.javascript.ru/switch
            // В случае выше разница не замента. Но если внутри внутри одной из веток условия добавляется еще несколько 
            // switch оказывается намного проще читать
            
            display.value = MemoryCurrentNumber;
            MemoryPendingOperation = op;
        };
        
      }

// Здесь хорошо было бы упомянуть еще и о том, что в JS результатом выражения 0.03 - 0.01 будет 0.019999...
// Это издержки отсутствия типа чисел с плавающей точкой в JS
// Хорошо иметь об этом представление. Подробно: https://learn.javascript.ru/switch

    function decimal(argument) {
        var localDecimalMemory = display.value;
        
        if(MemoryNewNumber) {
            localDecimalMemory = "0.";
            MemoryNewNumber = false;
        } else {
            // объяснения как работает indexOf(".") в ролике оставляют желать лучшего
            // Подробней тут: https://learn.javascript.ru/string#str-indexof
            if(localDecimalMemory.indexOf(".") === -1) {
                localDecimalMemory += "."
            }
        };
        display.value = localDecimalMemory;
        console.log("Клик по " )
    };

    function clear(id) {
        if(id === "ce") {
            display.value = "0" // здесь строка? или число?
            MemoryNewNumber = true;
        } else if(id === "c") {
            display.value = "0" 
            MemoryNewNumber = true;
            MemoryCurrentNumber = 0,
            MemoryPendingOperation = "";
        }
    };

