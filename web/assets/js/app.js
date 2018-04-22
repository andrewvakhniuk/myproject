$(function () {

    // Get the form.
    var form = $('#ajax-contact');

    // Get the messages div.
    var formMessages = $('#form-messages');

    // Set up an event listener for the contact form.
    $(form).submit(function (e) {
        // Stop the browser from submitting the form.
        e.preventDefault();

        // Serialize the form data.
        var formData = $(form).serialize();

        // Submit the form using AJAX.
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData
        })
            .done(function (response) {
                // Make sure that the formMessages div has the 'success' class.
                $(formMessages).removeClass('error');
                $(formMessages).addClass('success');

                // Set the message text.
                $(formMessages).text(response);

                // Clear the form.
                $('#name').val('');
                $('#email').val('');
                $('#subject').val('');
                $('#message').val('');
            })
            .fail(function (data) {
                // Make sure that the formMessages div has the 'error' class.
                $(formMessages).removeClass('success');
                $(formMessages).addClass('error');

                // Set the message text.
                if (data.responseText !== '') {
                    $(formMessages).text(data.responseText);
                } else {
                    $(formMessages).text('Oops! Error , message can not be sent...');
                }
            });
    });


// my code

    //--- START variables
    var $orderForm = $('#order-form');
    var $submitOrderButton = $('#submit-order-button');
    var $cityField = $('#appbundle_ordering_city');
    var $postOffice = $('#appbundle_ordering_postOffice');
    var $deliveryTypeHiddenField = $('#appbundle_ordering_deliveryType');  // 3 types : by_post/self_checkout/by_post_address
    var $deliveryTypeRadio = $('#delivery-type-radio');
    //select post & location description divs
    var $deliveryFields = $('.delivery-fields');
    var $paymentMethodHiddenField = $('#appbundle_ordering_paymentMethod');
    var $paymentMethodRadio = $('#payment-method-radio-container');
    var $quantityField = $('#appbundle_ordering_quantity');
    var $phoneField = $('#appbundle_ordering_phone');
    var $priceHiddenField = $('#appbundle_ordering_price');

    var discountPrice = 63;
    var afterDeliveryPaymentPrice = 30;
    var postServicePrice = 35;
    var productPrice = 189;
    function countDiscount(){
        return (discountPrice/(discountPrice+productPrice))*100;
    }

    var $price = $('#price');

    $('#order-header').append('<br><b>- '+countDiscount()+' %  </b><br><strike style="color:red;">'+ (productPrice + discountPrice ) +' UAH</strike><b> '+ productPrice +' UAH</b>');
    //--- END variables
    //count price
    function countPrice() {
        var servicePrice = 0;
        var deliveryType = $deliveryTypeRadio.find("input[name='radio']:checked").val();
        var paymentMethod = $paymentMethodRadio.find("input[name='radio-payment-method']:checked").val();

        if(deliveryType==='by_post'){
            servicePrice+=postServicePrice;
            if(paymentMethod === 'after_delivery'){
                servicePrice+= afterDeliveryPaymentPrice;
            }
        }
        var total = servicePrice + productPrice * $quantityField.val();
        var totalWithoutDiscount = servicePrice + (productPrice + discountPrice) * $quantityField.val();
        // alert(price);
        $price.html('<strike> '+totalWithoutDiscount+' UAH  </strike><b> '+total+' UAH </b>');

        $priceHiddenField.val(total);
        return total;
    }
    //make theme of select2 bootstrap
    $.fn.select2.defaults.set("theme", "bootstrap");

    // on quantity change change the price
    $quantityField.change(function () {
        countPrice();
    });

    //if farm was invalid


    // --- document ready
    $(document).ready(function () {
        countPrice();

        //url json to connect to Nova Poshta API 2.0
        var novaposhtaUrl = "https://api.novaposhta.ua/v2.0/json/";
        //personal API 2.0 KEY needed to connect to api
        var novaposhtaApiKey = "5ebb91ca0cca996fe101cddd6ecb8395";

        //params to look for cities using api
        var ajaxCityParams = {
            "apiKey": novaposhtaApiKey,
            "modelName": "Address",
            "calledMethod": "searchSettlements",
            "methodProperties": {
                "CityName": "-",
                "Limit": 20
            }
        };
        //init city field select2
        var placeholder = $('label[for="' + $cityField.attr('id') + '"]').text();
        console.log(placeholder);
        $cityField.select2({
            language: locale,
            placeholder: placeholder,
            theme: "bootstrap",
            minimumInputLength: 1,
            ajax: {
                "async": true,
                "crossDomain": true,
                "url": novaposhtaUrl,
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                },
                "processData": false,

                // modify params before sending , add city input to ajaxCityParams.methodProperties.CityName
                data: function (params) {
                    ajaxCityParams.methodProperties.CityName = params.term;
                    // obligatory , api receive params in json type
                    return JSON.stringify(ajaxCityParams);
                },
                // process data after receiving a success result to [{id: '',text: ''},..]
                processResults: function (data) {
                    if (data.success === true) {
                        var result = data.data[0].Addresses.map(function (address) {
                            //MainDescription is city name
                            return {id: address.MainDescription, text: address.MainDescription};
                        });
                        return {results: result};
                    } else {
                        return {results: []}
                    }

                }
            }
        });
        //params for receiving post  offices of Nova Poshta
        var ajaxWarehousesParams = {
            "apiKey": novaposhtaApiKey,
            "modelName": "AddressGeneral",
            "calledMethod": "getWarehouses",
            "methodProperties": {
                "CityName": "-",
                "Language": "ua"
            }
        };

        //init  post office field
        placeholder = $('label[for="' + $postOffice.attr('id') + '"]').text();
        $postOffice.select2({
            placeholder: placeholder,
            language: locale
        });
        // on city change
        $cityField.on('change', function () {
            // alert(typeof ($cityField.val()));
            ajaxWarehousesParams.methodProperties.CityName = $cityField.val();
            var data = JSON.stringify(ajaxWarehousesParams);
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": novaposhtaUrl,
                "method": "POST",
                "headers": {
                    "content-type": "application/json"
                },
                "processData": false,
                data: data,
                // process data after receiving a success result to [{id: '',text: ''},..]
                success: function (data) {
                    if (data.success === true) {
                        var warehouses = data.data.map(function (office) {
                            return {id: office.Description, text: office.Description};
                        });
                        //clear the postOffice field
                        $postOffice.val(null).empty().trigger('change');
                        $postOffice.select2({
                            'data': warehouses,
                            placeholder: placeholder,
                            language: locale
                        });
                    }
                }
            });
        });

        //on delivery type change
        $deliveryTypeRadio.change(function () {
            countPrice();
            // get selected delivery type id
            var selectedDeliveryType = $deliveryTypeRadio.find("input[name='radio']:checked").val();

            //set delivery type form hidden filed
            $deliveryTypeHiddenField.val(selectedDeliveryType);

            //hide and show needed delivery fields
            $deliveryFields.animate({
                height: "toggle"
            }, 100);
            // clear selects
            $postOffice.val(null).empty().trigger('change');
            $cityField.val(null).empty();
        });

        //  hide/show delivery type fields (select novaposhta or location description)
        $('#' + $deliveryTypeHiddenField.val() + '_fields').show();
        $('#' + $deliveryTypeHiddenField.val()).prop('checked', 'true');


        //on payment method change
        $paymentMethodRadio.change(function () {
            countPrice();
            // get selected payment method id
            var selectedPaymentMethod = $paymentMethodRadio.find("input[name='radio-payment-method']:checked").val();
            //set delivery type form hidden filed
            $paymentMethodHiddenField.val(selectedPaymentMethod);
        });


        //validate phone filed
        function validatePhone() {
            var filter = /^[0-9-+]+$/;
            if (filter.test($phoneField.val())) {
                return true;
            } else {
                $phoneField.parent().addClass('has-error');
            }
        }


        //check if all required fields are filled up
        function validateForm() {
            //check selects separately
            // alert( $postOffice.val()===null);
            if (validatePhone() && $orderForm[0].checkValidity() && (($deliveryTypeHiddenField.val() === 'by_post' && $cityField.val() !== null && $postOffice.val() !== null)
                    || ($deliveryTypeHiddenField.val() === 'self_checkout'))) {
                return true;
            } else {
                $orderForm.find(':input, select').each(function () {
                    if ($(this).val() === null || $(this).val() === "") {
                        $(this).parent().addClass('has-error');
                    }
                });
                if (!$orderForm[0].checkValidity()) {
                    $orderForm.find('input[type="submit"]').click();
                }

                return false;
            }
        }

        //on submit the form
        $submitOrderButton.on('click', function (e) {
            // $orderForm.submit();

            e.preventDefault();
            //trigger html5 validation
            if (validateForm()) {

                $orderForm.submit();

            }

        });


    });
    // -- END document ready
});
