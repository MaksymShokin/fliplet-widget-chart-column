var data = Fliplet.Widget.getData() || {
  show_data_legend: true,
  show_data_values: true,
  y_axix_title: '',
  x_axix_title: '',
  show_total_entries: '',
  auto_refresh: ''
};

var $dataSource = $('select#select-data-source');
var $dataColumns= $('select#select-data-column');
var organizationId = Fliplet.Env.get('organizationId');

console.log(data);

// Fired from Fliplet Studio when the external save button is clicked
Fliplet.Widget.onSaveRequest(function () {
  Fliplet.Widget.save({
    dataSourceId: $dataSource.val(),
    dataSourceColumn: $dataColumns.val(),
    show_data_legend: ($('#show_data_legend:checked').val() === "show" ? true : false),
    show_data_values: ($('#show_data_values:checked').val() === "show" ? true : false),
    y_axix_title: $('#yaxix_title').val(),
    x_axix_title: $('#xaxix_title').val(),
    show_total_entries: ($('#show_total_entries:checked').val() === "show" ? true : false),
    auto_refresh: ($('#auto_refresh:checked').val() === "refresh" ? true : false)
  }).then(function () {
    Fliplet.Widget.complete();
  });
});

Fliplet.DataSources.get({
  organizationId: organizationId
}).then(function (dataSources) {
  data.dataSources = dataSources;
  dataSources.forEach(function (dataSource) {
    $dataSource.append('<option value="' + dataSource.id + '">' + dataSource.name + '</option>');
  });

  // LOADS DATA SOURCE DATA
  // NEEDS TO BE DONE HERE BECAUSE THE SELECT BOX NEEDS TO BE DYNAMIC UPDATED
  if (data.dataSourceId) {
    $dataSource.val(data.dataSourceId).trigger('change');
    showColumnSelect();
  }
  if ( data.dataSourceId && data.dataSourceColumn ) {
    $dataColumns.val(data.dataSourceColumn).trigger('change');
  }
});

// LOAD CHART SETTINGS
if (data) {
  $('#show_data_legend').prop('checked', data.show_data_legend);
  $('#show_data_values').prop('checked', data.show_data_values);
  $('#yaxix_title').val(data.y_axix_title);
  $('#xaxix_title').val(data.x_axix_title);
  $('#show_total_entries').prop('checked', data.show_total_entries);
  $('#auto_refresh').prop('checked', data.auto_refresh);
}


// ATTACH LISTENERS
$dataSource.on('change', function(){
  var selectedValue = $(this).val();
  var selectedText = $(this).find("option:selected").text();

  $dataColumns.html('');
  // Appends Column Titles to new Select Box
  data.dataSources.forEach(function(dataSource) {
    if ( dataSource.hasOwnProperty('id') && dataSource.id == selectedValue ) {
      $dataColumns.append('<option selected value="">-- Select a column --</option>').trigger('change');
      dataSource.columns.forEach(function(column) {
        $dataColumns.append('<option value="' + column + '">' + column + '</option>');
      });
    }
  });

  $(this).parents('.select-proxy-display').find('.select-value-proxy').html(selectedText);
  showColumnSelect();
  checkDataIsConfigured();
})

$dataColumns.on('change', function() {
  var selectedValue = $(this).val();
  var selectedText = $(this).find("option:selected").text();
  $(this).parents('.select-proxy-display').find('.select-value-proxy').html(selectedText);
  checkDataIsConfigured();
});

$('.configure-chart').on('click', function() {
	$('.chart-settings a').trigger('click');
});

// FUNCTIONS
function parseDataSources() {

}

function showColumnSelect() {
  if ($('#select-data-source').val() !== 'none') {
    $('.select-data-column').removeClass('hidden');
  } else {
    if (!$('.select-data-column').hasClass('hidden')) {
      $('.select-data-column').addClass('hidden');
    }
  }
}

function checkDataIsConfigured() {
  if ($('#select-data-source').val() !== '' && $('#select-data-column').val() !== '') {
    $('.nav-tabs .chart-settings.disabled').removeClass('disabled');
    $('.controls').removeClass('hidden');
  } else {
    if ( !$('.nav-tabs .chart-settings').hasClass('disabled') ) {
      $('.nav-tabs .chart-settings').addClass('disabled');
    }
    if ( !$('.controls').hasClass('hidden') ) {
    	$('.controls').addClass('hidden');
    }
  }
}
