$(function () {

    // Get the form.
    var form = $('#ajax-contact');


    // Get the messages div.
    var formMessages = $('#form-messages');

    // Set up an event listener for the contact form.
    $(form).submit(function (e) {
        // Stop the browser from submitting the form.
        e.preventDefault();
        if($(form).attr('disabled')){
            return;
        }
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
    var $quantityField = $('#appbundle_ordering_quantity');
    var $phoneField = $('#appbundle_ordering_phone');
    var $priceHiddenField = $('#appbundle_ordering_price');

    var discountPercent = 49;//integer
    // var afterDeliveryPaymentPrice = 30;
    // var postServicePrice = 35;
    var productPrice = 159;
    function countDiscount(){
        return Math.round( productPrice*discountPercent/(100-discountPercent));
    }
    function countPriceWithoutDiscount(){
        return countDiscount()+productPrice;
    }
    var $price = $('#price');

    $('#order-header').append('<br><b style="color:red;">- '+discountPercent+' %  </b><strike style="font-size: 18px">'+ countPriceWithoutDiscount() +' грн</strike><b style="color:red;"> '+ productPrice +' грн</b>');
    //--- END variables
    //count price
    function countPrice() {

        var total =  productPrice * $quantityField.val();
        var totalWithoutDiscount = countPriceWithoutDiscount() * $quantityField.val();

        $price.html('<strike style="font-size: 17px"> '+totalWithoutDiscount+' грн  </strike><b style="color:red;"> '+total+' грн </b>');
        $priceHiddenField.val(total);

        return total;
    }

    // on quantity change change the price
    $quantityField.change(function () {
        countPrice();
    });



    // --- document ready
    $(document).ready(function () {
        countPrice();

        //validate phone filed
        function validatePhone() {
            var filter = /^[0-9-+]+$/;
            if (filter.test($phoneField.val())) {
                $phoneField.parent().parent().removeClass('has-error');
                return true;
            } else {
                $phoneField.parent().parent().addClass('has-error');
            }
        }

        //check if all required fields are filled up
        function validateForm() {
            //check selects separately
            // alert( $postOffice.val()===null);
            if (validatePhone() && $orderForm[0].checkValidity() ) {
                return true;
            } else {
                $orderForm.find(':input.check-error').each(function () {

                    if ($(this).val() === null || $(this).val() === "") {
                        $(this).parent().parent().addClass('has-error');
                    }else {
                        $(this).parent().parent().removeClass('has-error');
                    }
                    validatePhone();
                });
                // trigger html validate
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
