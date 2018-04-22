$(document).ready(function () {
    var columns = [
        {data: "id", type: "-"},
        {data: "date", type: ""},
        {data: "ip", type: "-"}
    ];


    $datatable = $('#datatable').DataTable({
        columns: columns,
        lengthChange: true,
        data: data,
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
        'order': [[1, 'asc']],
        select: {
            style: 'multi',
            selector: 'td:not(:last-child)'
        }
    });

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

});