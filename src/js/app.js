
var fieldControl = (function () {

    var data = {
        selectedDate: {
            cInDate: '',
            cOutDate: ''
        },
        roomType: '',
        selectLandscape: ''
    };

    return {

        addSelectDate: function (stardD, endD) {
            data.selectedDate.cInDate = stardD;
            data.selectedDate.cOutDate = endD;
        },

        getSelectedDate: function () {
            return {
                checkInDate: data.selectedDate.cInDate,
                checkOutDate: data.selectedDate.cOutDate,
            }
        },

        addRoomType: function (val) {
            data.roomType = val;
        },

        getRoomType: function () {
            return {
                roomType: data.roomType
            }
        },

        addSelectLandscape: function (val) {
            data.selectLandscape = val;
        },

        getSelectLandscape: function () {
            return {
                selectLandscape: data.selectLandscape
            }
        },

        getAllData: function () {
            return {
                checkInDate: data.selectedDate.cInDate,
                checkOutDate: data.selectedDate.cOutDate,
                roomType: data.roomType,
                selectLandscape: data.selectLandscape
            }
        },

        testItem: function () {
            console.log(data);
        }
       
    };

}) ();

var UIController = (function () {

    var DOMstring = {
        form: '#myForm',
        reservation: '.reservation',
        dpCheckIn: '#dpCheckIn',
        dpCheckOut: '#dpCheckOut',
        hdCheckInDate: '#hdCheckInDate',
        hdCheckOutDate: '#hdCheckOutDate',
        lblCheckInDate: '.labelCheckInDate',
        lblCheckOutDate: '.labelCheckOutDate',
        dp: '.dp',
        roomType: '.roomType',
        selectLandscape: '.selectLandscape',
        slbCardMonth: '#cardMonth',
        slcCardYear: '#cardYear',
        inRadio: 'input[radio]',
        payment: '.payment',
        cardNo: '#cardNo',
        cvvCode: '#cvvCode',
        cardName: '#cardName',
        cardMonth: '#cardMonth',
        cardYear: '#cardYear',
        lblCardName: '.card-name',
        lblCvvCode: '.cvv-code',
        lblCardNo: '.card-no',
        roomInfo: '#roomInfo',
        paymentInfo: '#paymentInfo'

    };

    return {
        getInput: function () {
            return {
                startD: document.querySelector(DOMstring.dpCheckIn).value,
                endD: document.querySelector(DOMstring.dpCheckOut).value
            }
        },

        getLabelSelectedDate: function (count, data) {
            document.querySelectorAll(DOMstring.lblCheckInDate)[count].innerText = data.checkInDate;
            document.querySelectorAll(DOMstring.lblCheckOutDate)[count].innerText = data.checkOutDate;
        },

        setRoomType: function (type) {
          document.querySelector(DOMstring.roomType).innerText = type.roomType;
        },

        setSelectLandscape: function (type) {
            document.querySelector(DOMstring.selectLandscape).innerText = type.selectLandscape;
        },

        getDOMstring: function () {
            return DOMstring;
        }
    };
}) ();

var controller = (function (FCtrl, UICtrl) {

    var setupEventListeners = function () {
        
        checkedRoomType();
        checkedSelectLandscape();

        datepicker();
        creditCard();
    };

    var selectBox = function () {
        var slcCardMonth = document.getElementById('cardMonth');
        var slcCardYear = document.getElementById('cardYear');
        var year = new Date().getFullYear();

        for (var i = 1; i <= 12; i++) {
            var opt = document.createElement('option');
            i = i < 10 ? '0' + i : i;
            opt.value = i;
            opt.innerHTML = i;
            slcCardMonth.appendChild(opt);
        }

        for (var i = year; i < year + 12; i++) {
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = i;
            slcCardYear.appendChild(opt);
        }
    };

    var validate = function () {
        var form = $("#myform");
        
        form.validate({
            errorPlacement: function errorPlacement(error, el) { 
                el.parent(error); 
            },
            rules: {
                rbRoomType: {
                    required: true
                },
                rbSelectLandscape: {
                    required: true
                }
            }
        });
        
        form.steps({
            headerTag: "h3",
            bodyTag: "section",
            transitionEffect: "slideLeft",
            labels: 
            {
                next: "İleri",
                previous: "Geri",
                finish: "Ödeme Yap",
            },
            onStepChanging: function (event, currentIndex, newIndex)
            {
        
                
                if (newIndex == 1) {
                    ctrlAddItem();
                    setLabelSelectedDate(0);
        
                } else if (newIndex == 2) {
                    ctrlAddItem();
                    setLabelSelectedDate(1);
                    addLocalStorage();
                    selectBox();                    
                }
                
                form.validate().settings.ignore = ":disabled,:hidden";
                return form.valid();
            },
            onFinishing: function (event, currentIndex)
            {
                form.validate().settings.ignore = ":disabled";
                var x = form.find('input[type=radio]');

                for (var i = 0; i < x.length; i++) {
                    // console.log($(x[i]).hasClass('error'));
                    // if (x[i].hasClass('error')) {
                    //     x[i].parent().addClass('error');
                    // }
                }
                return form.valid();
            },
            onFinished: function (event, currentIndex)
            {
                console.log(window.localStorage.getItem('reservation'));
                // alert("Rezervasyon işlemi başarılı");
                Swal.fire(
                    'Rezervasyon işlemi başarılı',
                    'success'
                  )
            }
        });  
    };

    var dateFormat = function(date) { // eslint-disable-line
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    };

    var datepicker = function () {
        var startDate, endDate;
        var $startDate = $('#dpCheckIn');
        var $endDate = $('#dpCheckOut');

        var pick = $startDate.datepicker().data('datepicker');

        $startDate.datepicker({
            dateFormat: 'dd/mm/yyyy',
            language: 'tr',
            minDate: new Date(),
            onSelect: function(selectedDate, date) {
                startDate = selectedDate;
                var endDateMinDate = dateFormat(date);
               

                $endDate.datepicker({
                    minDate: endDateMinDate
                }).data('datepicker').selectDate(new Date(endDateMinDate));
               
                pick.hide();
            }
        }).data('datepicker').selectDate(new Date());
      
        var pickEnd = $endDate.datepicker().data('datepicker');
        $endDate.datepicker({
                dateFormat: 'dd/mm/yyyy',
                language: 'tr',
                onSelect: function(selectedDate) {
                    endDate = selectedDate;
                    pickEnd.hide();
            }
        });

        FCtrl.addSelectDate(startDate, endDate);

    };

    var addLocalStorage = function () {
        var reservation = {};

        var data =  FCtrl.getAllData();

        reservation.checkInDate = data.checkInDate;
        reservation.checkOutDate = data.checkOutDate;
        reservation.roomType = data.roomType;
        reservation.selectLandscape = data.selectLandscape;

        window.localStorage.setItem('reservation', JSON.stringify(reservation));
    };
 
    var ctrlAddItem = function () {
        var input;

        input = UICtrl.getInput();

        if (input.startD !== '' && input.endD !== '') {

            FCtrl.addSelectDate(input.startD, input.endD);
        }
    };
    
    var setLabelSelectedDate = function (index) {
        var data = FCtrl.getSelectedDate();

        UICtrl.getLabelSelectedDate(index, data);

    };

    var checkedRoomType = function () {
        var ele = document.getElementsByName('rbRoomType'); 
        
        for(var i = 0; i < ele.length; i++){
            ele[i].onclick = function() {
                FCtrl.addRoomType(this.parentNode.querySelector('label').innerText);
                var roomType = FCtrl.getRoomType();
                UICtrl.setRoomType(roomType);
            }
        }
    };

    var checkedSelectLandscape = function () {
        var ele = document.getElementsByName('rbSelectLandscape'); 
        for(var i = 0; i < ele.length; i++){
            ele[i].onclick = function() {
                FCtrl.addSelectLandscape(this.parentNode.querySelector('label').innerText);
                var selectLandscape = FCtrl.getSelectLandscape();
                UICtrl.setSelectLandscape(selectLandscape);
            }
        }
    };

    var creditCard = function () {
        var payment, cardNo, cardName, cardMonth, cardYear, cvvCode;
    
        payment = $('.payment');
        cardNo = payment.find('#cardNo');
        cvvCode = payment.find('#cvvCode');
        cardName = payment.find('#cardName');
        cardMonth = payment.find('#cardMonth');
        cardYear = payment.find('#cardYear');

        payment.find('.card-name p').text(cardName.attr('placeholder'));
        payment.find('.cvv-code').text(cvvCode.attr('placeholder'));
        payment.find('.card-no p:last-child').text(cardNo.attr('placeholder'));

        cardName.on('keyup', function () {
            var self = $(this);
            var type = self.data('type');
            var val = self.val();
           
            lettersAndNumberControl(type, self, val);
            var val = $(this).val().toUpperCase();

            if ($(this).val() === '') {
                $(this).closest('.payment').find('.card-name').find('p').text($(this).attr('placeholder'));
            } else {
                $(this).closest('.payment').find('.card-name').find('p').text(val);
            }
        });
    
        cvvCode.on('keyup', function () {
            if ($(this).val() === '') {
                $('.back .ccv').find('p').text('123');
            } else {
                $('.back .ccv').find('p').text($(this).val());
            }
        }).on('focus', function () {
            $('.credit-card').addClass('turn');
        }).on('blur', function () {
            $('.credit-card').removeClass('turn');
        });
    
        cardNo.on('keyup', function () {
            var self = $(this);
            var type = self.data('type');
            var val = self.val();
           
            lettersAndNumberControl(type, self, val);
            self.mask('9999 9999 9999 9999', { placeholder: '____ ____ ____ ____' });

            if (val === '') {
                $('.card-number').find('p').text('0000 0000 0000 0000');
            } else {
                $('.card-number').find('p').text($(this).val());
            }
            
        });
    
        cardMonth.on('change', function () {
            $(this).closest('.payment').find('.card-month').text($(this).find(':checked').val());
        });
    
        cardYear.on('change', function () {
            var val = $(this).find(':checked').val();
    
            $(this).closest('.payment').find('.card-year').text(val.substr(val.length - 2));
        });
    };

    var lettersAndNumberControl = function (type, input, val) {
        var reg = new RegExp('^[0-9]+$');
        var repReg = /[^0-9]+$/g;
        var regLetter = /^[a-zA-Z\sığüşöçİĞÜŞÖÇ]+$/;
    
        if (type === 'only-letters') {
          reg = regLetter;
          repReg = /[^a-zA-Z\sığüşöçİĞÜŞÖÇ]/g;
        }
    
        if (val.match(reg)) {
          input.removeClass('error');
          return true;
          // eslint-disable-next-line no-else-return
        } else {
          input.focus();
          input.val(input.val().replace(repReg, ''));
          input.addClass('error');
          return false;
        }
    }

    return{
        init: function () {
            validate();
            setupEventListeners();
        }
    }
}) (fieldControl, UIController);

controller.init();