$(document).ready(function () {
    var columns = [
        {data: "id", type: "-"},
        {data: "date", type: ""},
        {data: "name", type: "-"},
        {data: "email", type: "-"},
        {data: "phone", type: "-"},
        {data: "status", type: "Choice", choices: ["new", "in_progress", "sent", "complete", "returned"]},
        {data: "city", type: "-"},
        {data: "postOffice", type: "-"},
        {data: "payed", type: "Choice", choices: ["false", "true"]},
        {data: "quantity", type: "-"},
        {data: "price", type: "-"},
        {data: "deliveryType", type: "Choice", choices: ["self_checkout", "by_post"]},
        {data: "paymentMethod", type: "Choice", choices: ["by_card", "after_delivery"]},
        {data: "ipAddress", type: "-"},
        {data: "details", type: "-"}
    ];


    $datatable = $('#datatable').DataTable({
        // "processing": true,
        // responsive: true,
        ajax: 'datatable_ajax',
        columns: columns,
        lengthChange: true,
        dom: 'Blfrtip',
        buttons: [
            {
                className: "datatable-search-button",
                text: "Filter",
                action: function (e, dt, node, config) {
                    $('#filter').toggle();
                }
            },

            {
                // className: "datatable-search-button",
                text: " Select all",
                action: function (e, dt, node, config) {
                    $datatable.rows({search: 'applied'}).select()
                }
            },
            {
//
                text: 'Clear All',
                action: function (e, dt, node, config) {
                    $('.all-search').val('');
                    $datatable.search('')
                        .columns().search('')
                        .draw();
                    $datatable.rows().deselect();
                }
            },
            'copy',
            'excel',
            'pdf',
            'print',
            'colvis'

        ],
        'columnDefs': [

            {
                'targets': 14,
                'searchable': false,
                'orderable': false,
                // 'className': '',
                'render': function (data, type, full, meta) {
                    return '<a class="details btn btn-info btn-sm"  href=' + full['id'] + '/show>Details</a>';
                }
            }
        ],
        'order': [[1, 'asc']],
        select: {
            style: 'multi',
            selector: 'td:not(:last-child)'
        }
    });
    $('.datatable-search-button').find('span').addClass("glyphicon glyphicon-search");

    var $changeStatusDropdown = $('#change-status-dropdown');
    $('#datatable_filter').append($changeStatusDropdown);
    $datatable.buttons().container()
        .appendTo('#datatable_wrapper .col-md-6:eq(0)');

    // Setup - add a text input to each search cell
    var i = 0;
    $('#datatable #filter th').each(function () {
        if (columns.length > i)
            var type = columns[i]['type'];
        // else
        //     var type = '';

        var title = $(this).text();
//                alert('title- '+ title + ', type - ' +type);

        if (title !== '') {

            if (type) {
                if (type.indexOf('Choice') !== -1) {
                    var html = '<select class="all-search search-field form-control"  style="position:relative;width:100%; " ><option value="" selected data-default>Search' + title + '</option>';
                    for (var j = 0; j < columns[i]['choices'].length; j++) {
                        html += '<option value="' + columns[i]['choices'][j] + '">' + columns[i]['choices'][j] + '</option>';
                    }
                    html += '</select>';
                    $(this).html(html);
                } else {

                    $(this).html('<input type="text" class="all-search search-field form-control" style="position:relative;width:100%; " placeholder="Search' + title + '" />');

                }
            } else {
                $(this).html('<input type="text" class="all-search date-from date-datepicker form-control" style="position:relative;width:100%; " placeholder="Since" />' + '-' +
                    '<input type="text" class="all-search date-to date-datepicker form-control" style="position:relative;width:100%; " placeholder="To" />');
                var filter = this;
                var j = i;
                //add filter for each fromData and ToData
                $.fn.dataTable.ext.search.push(
                    function (settings, data, dataIndex) {
                        var min = $(filter).find('.date-from').datepicker("getDate");
                        var max = $(filter).find('.date-to').datepicker("getDate");
//                                        alert(i);
                        var startDate = new Date(data[j]);
                        if (min == null && max == null) {
                            return true;
                        }
                        if (min == null && startDate <= max) {
                            return true;
                        }
                        if (max == null && startDate >= min) {
                            return true;
                        }
                        if (startDate <= max && startDate >= min) {
                            return true;
                        }
                        return false;
                    }
                );
            }
        }
        i++;
    });


    //make datepicker above bootstrap button
//            $('.paginate_button a').css('z-index',0);
    /**-------------add datepicker to each date filter input --------------*/
    var $datepicker = $('.date-datepicker').datepicker({
        dateFormat: "yy-mm-dd",
        showButtonPanel: true,
        autoSize: true,
        closeText: "Clear",
        onClose: function (dateText, obj) {
            var event = arguments.callee.caller.caller.arguments[0];
            // If "Clear" gets clicked, then really clear it
            if ($(event.delegateTarget).hasClass('ui-datepicker-close')) {
                $(this).val('');
                $datatable.draw();
            }
        }
        // ,
        // beforeShow: function () {
        //     setTimeout(function () {
        //         $('.ui-datepicker').css('z-index', 999);
        //     }, 0);
        // }
    });

    $datepicker.on('keyup change', function () {
        $datatable.draw();
    });
    /**-------------on change filter input search and draw------------------*/
    $('.search-field').on('keyup change', function () {
        var visIdx = $(this).closest('th').index();
        var colNumber = $datatable.column.index('fromVisible', visIdx);
        $datatable.columns(colNumber).search(this.value).draw();
    });

    /**-------------column visibility --------------*/
    columnVisibility($datatable);

    // START change status
    $('.change-status').on('click', function (e) {
        e.preventDefault();
        if($(this).hasClass('disabled')){
            return ;
        }
        var selectedRows =$datatable.rows( { selected: true } );
        if(!selectedRows.count()){
            alert('Select orders');
            return;
        }
        //disable all actions
        $('.change-status').addClass('disabled');
        // console.log(selectedRows.data());
        var selectedData = selectedRows.data();
        var ids = [];
        // console.log(selectedData.length);
        for(i = 0;i<selectedData.length;i++ ){
            ids.push(selectedData[i]['id']);
        }
        // console.log(ids);
        var data = {
            ids:ids,
            value: $(this).attr('id')
        };
        if($(this).hasClass('order-status')){
            data.field = 'status';
        }else {
            data.field = 'payed';
        }
        console.log(data);

        $.ajax({
            type: 'POST',
            url: 'change_status',
            data: data,
        }).done(function(data){
            $datatable.ajax.reload();
            $('.change-status').removeClass('disabled');

        }).fail(function(data){
            alert('Error, ask Andrew admin for help');
            $('.change-status').removeClass('disabled');

        });
        // console.log(data);

    });
    // END change status

});