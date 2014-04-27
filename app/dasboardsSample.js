/**
* dashboardsSample Module
*
* Description
*/
angular.module('dashboardsSample', [])
	.run(function(){
		
		window.Dashboards = {};
		Dashboards.components = [];

		Dashboards.addComponents = function(compArray){
			Dashboards.components = _.union( Dashboards.components, compArray);
		}




		var render_storeFormatSelector = {
			type: "Select",
			name: "render_storeFormatSelector",
			priority: 5,
			parameter: "storeFormatParam",
			htmlObject: "storeFormatSelectorObj",
			listeners: [],
			parameters: [],
			valuesArray: [["-","-"]],
			valueAsId: false,
			executeAtStart: true,
			preExecution: function f(){
		    this.valuesArray = sears.getSelectorValuesArray( 'storeFormat');

		    if (!this.valuesArray ){
		        Dashboards.log("We should never see this log message!!!");
		        return false;
		    }
		}
		,
			postExecution: function f(){
		    Dashboards.processChange(this.name);    
		},
			preChange: function f(v){
		    var store = ( v == 1) ? 'sears' : 'kmart';
		    sears.loadSettings( sears._cachedSettings[store], true);
		    return v
		},
			extraOptions: [],
			queryDefinition:  {

			}
		};

		var render_buSelector = {
			type: "Select",
			name: "render_buSelector",
			priority: 5,
			parameter: "buParam",
			htmlObject: "buSelectorObj",
			listeners: ['storeFormatParam'],
			parameters: [],
			valuesArray: [["-","-"]],
			valueAsId: false,
			executeAtStart: false,
			preExecution: function f(){
		    this.valuesArray = sears.getSelectorValuesArray( 'bu');

		    if (!this.valuesArray ){
		        Dashboards.log("We should never see this log message!!!");
		        return false;
		    }
		}
		,
			postExecution: function f(){
		    Dashboards.processChange(this.name);    
		},
			extraOptions: [],
			queryDefinition:  {

			}
		};

		var render_buDivisionSelector = {
			type: "Select",
			name: "render_buDivisionSelector",
			priority: 5,
			parameter: "buDivisionParam",
			htmlObject: "buDivisionSelectorObj",
			listeners: ['buParam'],
			parameters: [],
			valuesArray: [["-","-"]],
			valueAsId: false,
			executeAtStart: false,
			preExecution: function f(){
		    this.valuesArray = sears.getSelectorValuesArray( 'buDivision');

		    if (!this.valuesArray ){
		        Dashboards.log("We should never see this log message!!!");
		        return false;
		    }
		}
		,
			postExecution: function f(){
		    Dashboards.processChange(this.name);    
		},
			extraOptions: [],
			queryDefinition:  {

			}
		};

		var render_dashboardSelector = {
			type: "Select",
			name: "render_dashboardSelector",
			priority: 5,
			parameter: "dashboardParam",
			htmlObject: "dashboardSelectorObj",
			listeners: ['buDivisionParam'],
			parameters: [["buParam","buParam"],["storeFormatParam","storeFormatParam"],["buDivisionParam","buDivisionParam"]],
			postFetch: function f(data){
		    
		    var rawData = data.resultset;
		    
		    rawData.unshift( ["--", "All Dashboards"] ); //add extra option to the begin of the array
		    data.resultset = rawData;
		    
		    return data;
		}
		,
			valuesArray: [],
			valueAsId: false,
			executeAtStart: false,
			preChange: function f(value){
		    
		    var newLocation = '',
		        bookmarkState = Dashboards.getBookmarkState().params || {},
		        isNew = false;
		    
		    if (value == '--') {  // dashboardSelector = "All Dashboards"
		        newLocation = '/pentaho/api/repos/:public:Sears:level1.wcdf/generatedContent';
		    }
		    else {
		        newLocation = '/pentaho/api/repos/:public:Sears:level2.wcdf/generatedContent';
		    }
		    
		    bookmarkState[this.parameter] = value;
		    sears.changeLocation( newLocation, bookmarkState, isNew);
		    
		},
			extraOptions: [],
			queryDefinition:  {
				dataAccessId: "metricsGroupQuery",
				path: "/public/Sears/level3.cda"
			}
		};

		var render_timeframeSelector = {
			type: "Select",
			name: "render_timeframeSelector",
			priority: 10,
			parameter: "timeframeParam",
			htmlObject: "timeframeSelectorObj",
			listeners: [],
			parameters: [],
			valuesArray: [],
			valueAsId: false,
			executeAtStart: true,
			postExecution: function f(){
		    sears.putTimeframeDescription.apply( this );
		},
			postChange: function f(){
		    sears.putTimeframeDescription.apply( this );
		},
			extraOptions: [],
			queryDefinition:  {
				dataAccessId: "timeframeQuery",
				path: "/public/Sears/level3.cda"
			}
		};

		var render_drilldownFilter = {
			type: "Select",
			name: "render_drilldownFilter",
			priority: 5,
			parameter: "drilldownFilterParam",
			htmlObject: "drilldownFilterObj",
			listeners: ['drilldownFilterParam','measuresParam'],
			parameters: [],
			valuesArray: [["merchandise","Merchandise View"],["team","Team View"]],
			valueAsId: false,
			executeAtStart: false,
			postExecution: function f(){ 
		    var history = Dashboards.getParameterValue('focusHistory');
		    Dashboards.fireChange( 'focusHistory', history);
		},
			postChange: function f(v){
		    Dashboards.fireChange('focusHistory', []);    
		},
			extraOptions: [],
			queryDefinition:  {

			}
		};

		var render_levelTabs = {
			type: "multiButton",
			name: "render_levelTabs",
			priority: 5,
			parameter: "levelParam",
			htmlObject: "levelTabsObj",
			listeners: ['focusParam'],
			parameters: [],
			valuesArray: [["-","-"]],
			valueAsId: false,
			isMultiple: false,
			executeAtStart: false,
			preExecution: function f(){
		    
		    var dimKey = Dashboards.getParameterValue('drilldownFilterParam'),
		        va = sears.getDimensionLevelsArray( dimKey );
		    
		    this.valuesArray = va;

		    if (!this.valuesArray){
		        Dashboards.log("We should never see this log message!!!");
		        return false;
		    }
		 
		}
		,
			postExecution: function f(){
		    Dashboards.processChange(this.name);    
		},
			postChange: function f(v){
		    var dimKey   = Dashboards.getParameterValue('drilldownFilterParam'),
		        levelKey = v,
		        level = sears.getDimension( dimKey, 'levels', levelKey),
		        param = [];
		    param = sears.updateExpanded( level.mdx, true, param);
		    Dashboards.fireChange('limitParam', sears.getSettings('defaultLevel3Top'));
		    Dashboards.fireChange('expandedParam', param);
		    
		},
			queryDefinition:  {

			}
		};

		var render_selectedMetric = {
			type: "textComponent",
			name: "render_selectedMetric",
			priority: 5,
			expression: function f(){
		    var metricParamName = 'metricParam',
		        selectedbreakdownParamName = 'metricBreakdownParam',
		        metric = Dashboards.getParameterValue(metricParamName);
		        
		    //Dashboards.setParameter(selectedbreakdownParamName, metric);

		    return metric;
		},
			htmlObject: "selectedMetricObj",
			listeners: ['metricParam'],
			executeAtStart: true
		};

		var render_dashTitle = {
			type: "textComponent",
			name: "render_dashTitle",
			priority: 5,
			expression: function f(){
		    return Dashboards.getParameterValue('metricParam');
		},
			htmlObject: "titleObj",
			listeners: ['metricParam'],
			executeAtStart: true
		};

		var render_chartTitle = {
			type: "textComponent",
			name: "render_chartTitle",
			priority: 5,
			expression: function f(){
		    var selectedMetric = Dashboards.getParameterValue('metricBreakdownParam'),
		        metricParam = Dashboards.getParameterValue('metricParam');
		        //selectedGroup = Dashboards.getParameterValue('groupParam');

		    if(selectedMetric == metricParam) {
		        selectedMetric = "Actual";
		    }
		    
		    return selectedMetric;
		},
			htmlObject: "chartTitleObj",
			listeners: ['metricBreakdownParam'],
			executeAtStart: false
		};

		var render_addedMetricsFromTable = {
			type: "textComponent",
			name: "render_addedMetricsFromTable",
			priority: 5,
			expression: function f(){
		    var selectedParamName = 'selectedMetricsParam',
		        selectedValues = Dashboards.getParameterValue(selectedParamName),
		        title = "Added from metric drilldown table below:",
		        $container = "",
		        $legendContainer = "";
		    
		    if (selectedValues.length > 0) {
		        
		        $container = $("<div class='chartLegendHeader'>" + title + "</div>" );
		        $legendContainer = $("<div class='legendContainer'></div>" );
		        $legendContainer.appendTo($container);
		        
		        _.each(selectedValues, function(rowObj) {
		            var color = sears.getColor(rowObj.label);
		            var $aux = $("<div class='legendItem'>" +
		                            "<span class='legendColor'> </span>" +
		                            "<span class='legendLabel'>" + rowObj.label + "</span>" +
		                            "<span class='legendSeparator'> | </span>" +
		                            "<span class='removeIcon'> </span>" +
		                        "</div>"
		                );
		            $aux.find('.legendColor').css('background-color', color);
		            $aux.appendTo($legendContainer);
		        });
		    
		        
		        $container.find('.removeIcon')
		            .bind("click" , function(){
		                
		                var label = $(this).parent().find('.legendLabel').text(),
		                    itemToRemove = _.findWhere( selectedValues, {label: label} );
		                sears.updateSelected(itemToRemove.id, itemToRemove.label, selectedValues);
		                Dashboards.fireChange(selectedParamName, selectedValues);
		            });
		        
		    }
		                
		                
		    return $container;
		},
			htmlObject: "addedMetricsFromTableObj",
			listeners: ['metricBreakdownParam','selectedMetricsParam'],
			executeAtStart: true
		};

		var render_infoTableFocus = {
			type: "textComponent",
			name: "render_infoTableFocus",
			priority: 5,
			expression: function f(){
		    var historyParamName = 'focusHistory',
		        drillParamName = 'drilldownFilterParam',
		        history = Dashboards.getParameterValue(historyParamName),
		        view = Dashboards.getParameterValue(drillParamName),
		        label = sears.getDimension( view, 'label' ),
		        $container = $("<div class='historyContainer'/>");
		        
		    _.each(history, function(item, idx){
		        var partialHistory = history.slice(0,idx),
		            dimLabel = sears.getDimension( item.dim, 'label' ),
		            itemLabel = item.label,
		            $item = $("<div class='historyItem'/>")
		                .text(' > ')
		                .appendTo($container),
		            $action = $("<a class='historyAction'/>")
		                .text( dimLabel + " (" + itemLabel + ")")
		                .click(function(){
		                    Dashboards.setParameter( historyParamName, partialHistory);
		                    Dashboards.fireChange(drillParamName, item.dim );
		                })
		                .prependTo($item);
		    });
		    
		    $container.append( $('<span/>').text(label) );
		    
		    return $container;
		},
			htmlObject: "infoTableFocusObj",
			listeners: ['focusHistory'],
			executeAtStart: false,
			postExecution: function f(){
		    var history = Dashboards.getParameterValue('focusHistory'),
		        focus = _.isEmpty(history) ? "" : (_.last(history).id || "");
		    Dashboards.log('Focus: ' + focus);
		    Dashboards.fireChange('focusParam', focus);    
		}
		};

		var render_breakdownTable = {
			type: "Table",
			name: "render_breakdownTable",
			priority: 15,
			htmlObject: "breakdownTableObj",
			listeners: ['buDivisionParam','timeframeParam'],
			parameters: [["buParam","buParam"],["storeFormatParam","storeFormatParam"],["buDivisionParam","buDivisionParam"],["dashboardParam","dashboardParam"],["metricParam","metricParam"],["timeframeParam","timeframeParam"]],
			executeAtStart: false,
			postFetch: function f(data){
		    
		    var measureIdx = sears.getIndex('measure', 'level3BreakdownTable'),
		        measures  = _.pluck( data.resultset || [], measureIdx);
		    Dashboards.fireChange('measuresParam', measures);
		},
			preExecution: function f(){
		   
		    /* Ref: plugin-samples/pentaho-cdf-dd/tests/addIns */

		    
		    var map = sears.getSettings('formatMap');

		    function formattedTextOpts(st) {
		        var out = {},
		            indexMap = sears.getSettings( 'indexMaps', 'level3BreakdownTable'),
		            rowObj = sears.getRowObj( st.tableData[st.rowIdx], 'level3BreakdownTable');
		        
		        if (st.colIdx == indexMap.measure ) {    // measure name
		            out.textFormat = function(v, st){
		                var group = rowObj.group,
		                    measure = rowObj.measure,
		                    showGroup = false,
		                    $container,
		                    previousRowObj,
		                    previousGroup;
		                    
		                if (st.rowIdx == 0) {
		                    showGroup = true;
		                } 
		                else {
		                    previousRowObj = sears.getRowObj( st.tableData[st.rowIdx-1], 'level3BreakdownTable');
		                    previousGroup = previousRowObj.group;
		                    showGroup = (previousGroup != group);
		                }
		                
		                if (showGroup) {
		                    $(st.target).parent().addClass('groupRow');
		                    $container = $(
		                        "<div class='labelsContainer'>" +
		                            "<div class='groupName'>" + group + "</div>" + 
		                            "<div class='measureName'>" + measure + "</div>" + 
		                            "<div class='vertexIcon pos1'> </div>" +
		                        "</div>"
		                    );
		                }
		                else {
		                    $container = $(
		                        "<div class='labelsContainer'>" +
		                            "<div class='measureName'>" + measure + "</div>" +
		                            "<div class='vertexIcon pos2'> </div>" +
		                        "</div>"
		                    );
		                }
		                
		                return $container;
		            }
		        }
		        
		        else if(st.colIdx == indexMap.isValueAvailable ){   //format value
		            out.textFormat = function(v, st){
		                var ftKey = rowObj.format,
		                    available = sears.isAvailable( rowObj.isValueAvailable ),
		                    v = rowObj.value,
		                    ft = map[ftKey];
		                return available ? sears.formatValues( ft, v ) : sears.getSettings('notAvailable');
		            }
		        }
		        
		        else if(st.colIdx == indexMap.value ) {  // we will use this column to show the line color used in the chart
		            out.textFormat = function(v, st){
		                var $container = $( "<div class='legendColorContainer'>" +
		                                        "<div class='legendColor'> </div>" +
		                                    "</div>"
		                    );

		                return $container;  
		            }
		        }

		        return out;
		    }
		    this.setAddInOptions("colType","formattedText",formattedTextOpts);


		    this.setAddInOptions('colType','dynamicColType',function(st){
		        var rowObj = sears.getRowObj(st.tableData[st.rowIdx], 'level3BreakdownTable'), 
		            available = sears.isAvailable( rowObj.isTrendAvailable ),
		            out  = { compName: 'render_breakdownTable' };
		        out.colType = available ? 'trendArrow' : 'formattedText';
		        return out;
		    });
		    
		    
		}
		,
			postExecution: function f() {
		    
		    /* Pre-select the first row */
		    var ph = $('#'+this.htmlObject+'Table');
		    setTimeout( function(){
		        ph.find('tbody tr:eq(0) td:eq(0)').trigger('click');
		    }, 100);
		    
		    ph.find('tbody tr:eq(0) td:eq(0)').find('.measureName').text("Actual");
		},
			extraOptions: [],
			expandParameters: [],
			expandOnClick: false,
			chartDefinition:  {
				dataAccessId: "level3MetricsBreakdownQuery",
				path: "/public/Sears/level3.cda",
				clickAction: function f(st){
		    var rowObj = sears.getRowObj( st.tableData[st.rowIdx], 'level3BreakdownTable'),
		        selectedMetric = rowObj.measure,
		        selectedMetricParamName = 'metricBreakdownParam',
		        formatParamName = 'formatYaxisParam',
		        mapFormat = sears.getSettings('formatMap'),
		        formatKey = rowObj.format,
		        format = mapFormat[formatKey],
		        mapSettings = $.extend( true, {}, sears.getSettings('chartColorSettings') );
		    
		    mapSettings.map[selectedMetric] = 'mainMetric';
		    sears.loadMap(mapSettings);
		    var color = sears.getColor(selectedMetric);
		    
		    var ph = $('#'+this.htmlObject+'Table');
		    ph.find('tbody tr').removeClass('metricBreakdownSelected');
		    ph.find('.legendColor').css('background-color', 'transparent');

		    var selectedRow = ph.find('tbody tr:eq('+st.rowIdx+')');
		    selectedRow.addClass('metricBreakdownSelected');
		    selectedRow.find('.legendColor').css('background-color', color);
		        
		    Dashboards.log("Selected 'metricBreakdownParam': " + selectedMetric);
		    Dashboards.setParameter(formatParamName, format);
		    Dashboards.fireChange(selectedMetricParamName, selectedMetric);  //this triggers the update of chart component
		}
		,
				colHeaders: [],
				colTypes: ["hidden","formattedText","hidden","hidden","dynamicColType","formattedText","formattedText"],
				colFormats: [],
				colWidths: [],
				colSortable: [],
				colSearchable: [],
				paginate: false,
				paginateServerside: false,
				paginationType: "full_numbers",
				filter: false,
				info: false,
				sort: false,
				sortBy: [],
				lengthChange: false,
				tableStyle: "classic"
			}
		};

		var render_drilldownTable = {
			type: "Table",
			name: "render_drilldownTable",
			priority: 5,
			htmlObject: "drilldownTableObj",
			listeners: ['sortParam','expandedParam','selectedMetricsParam'],
			parameters: [["buParam","buParam"],["storeFormatParam","storeFormatParam"],["buDivisionParam","buDivisionParam"],["dashboardParam","dashboardParam"],["metricParam","metricParam"],["timeframeParam","timeframeParam"],["drilldownFilterParam","drilldownFilterParam"],["expandedParam","JSON.stringify(expandedParam)"],["sortParam","JSON.stringify(sortParam)"],["focusParam","focusParam"]],
			executeAtStart: false,
			postFetch: function f(data){
		    
		    var map = sears.getSettings('formatMap'),
		        drillParamName = 'drilldownFilterParam',
		        historyParamName = 'focusHistory',
		        expandedParamName = 'expandedParam',
		        selectedParamName = 'selectedMetricsParam',
		        limitParamName = 'limitParam',
		        levelParamName = 'levelParam';
		    
		    var labelsMap = sears.getLabelsMap(data.resultset, 'level3Table');
		    Dashboards.fireChange('labelsMap', labelsMap);
		    
		    var expanded  = sears.getExpandedFromData(data.resultset, 'level3Table'),
		        dimKey    = Dashboards.getParameterValue(drillParamName),
		        levelKey  = Dashboards.getParameterValue(levelParamName),
		        levelMdx  = sears.getDimension(dimKey, "levels", levelKey, 'mdx'),
		        levelSize = Dashboards.getParameterValue(limitParamName);
		    expanded = sears.updateExpanded( levelMdx, levelSize, expanded);
		    Dashboards.fireChange(expandedParamName, expanded);
		    Dashboards.log('Sync Expanded: ' + JSON.stringify(expanded));
		    
		    var cd = this.chartDefinition;
		    
		    var colTypesMap = {
		        //isExpanded: 'formattedText',
		        trend:      'trendArrow',
		        label:      'formattedText',
		        manager:    'formattedText',
		        _measure:   'formattedText'
		    }; 
		    
		    var measures = Dashboards.getParameterValue('measuresParam'),
		        numMeasures = measures.length;
		    
		    function getShiftedIdx(colMetadata){
		        return colMetadata.colIndex - 12;
		    }
		    function getMeasureIdx(colMetadata){
		        var shiftedIdx = getShiftedIdx(colMetadata);
		        return Math.floor(shiftedIdx/3);   
		    }
		    function isMeasureCol (colMetadata){
		        var shiftedIdx = getShiftedIdx(colMetadata),
		            measureIdx = getMeasureIdx(colMetadata);
		        return (measureIdx >=0) && ( shiftedIdx%3 === 0) ;
		    }
		    function isVisibleMeasureCol (colMetadata){
		        var measureIdx = getMeasureIdx(colMetadata);
		        return (measureIdx >= 1) && (measureIdx < numMeasures);  
		    }

		    cd.colTypes = _.map( data.metadata, function(colMetadata) {
		        var key = sears.getKey( colMetadata.colIndex, 'level3Table' ),
		            out = 'hidden';
		        if (!!colTypesMap[key] ) {
		            out = colTypesMap[key]; 
		        } else if ( isMeasureCol(colMetadata) ) {
		            var measureIdx = getMeasureIdx(colMetadata);
		            colMetadata.colName = measures[measureIdx];
		            if ( isVisibleMeasureCol(colMetadata)){
		                out = colTypesMap['_measure'];                
		            }
		        }
		        return out;
		    });
		    
		    var columnNames = _.pluck( data.metadata, 'colName' );
		    columnNames[0] = columnNames[8] = " ";
		    columnNames[7] = "Location";
		    columnNames[9] = columnNames[12];
		    cd.colHeaders = columnNames;


		    /* Add an extra columns to the end of the table, 
		     *  so we can implement the "horizontal scroll / paginate columns" functionality
		     * Reference:  http://datatables.net/release-datatables/examples/ajax/null_data_source.html */
		    _.each( data.resultset, function(row){
		        row.push("");
		    });
		    cd.colHeaders.push('pagination');

		    var objOpts = Dashboards.propertiesArrayToObject( this.extraOptions);
		    objOpts.aoColumnDefs = [ {
		        "aTargets": [ data.metadata.length ],
		        "mDataProp": null
		    } ];
		   this.extraOptions = Dashboards.objectToPropertiesArray( objOpts );



		    var indentIdx = sears.getIndex('indentLevel', 'level3Table'),
		        indentLevels = _.pluck( data.resultset, indentIdx),
		        minIndent = _.min(indentLevels);
		    Dashboards.log('minIndent:' + minIndent);

		    /* Add-ins Reference:  plugin-samples/pentaho-cdf-dd/tests/addIns */
		    function formattedTextOpts(st) {
		        var out = {},
		            indexMap = sears.getSettings( 'indexMaps', 'level3Table'),
		            rowObj = sears.getRowObj( st.tableData[st.rowIdx], 'level3Table');
		        
		        if (st.colIdx === indexMap.label) {    //format "location" column
		            out.textFormat = function(v, st){
		                var short_level = rowObj.shortLevel,
		                    level_desc = rowObj.label,
		                    manager = rowObj.manager;
		                    
		                var $container = $( "<div class='firstColumnCellContainer'>" +
		                                        "<div class='expandIcon'> </div>" +
		                                        "<div class='levelAndManagerDesc'>" +                
		                                            "<div>" +
		                                                "<span class='prefix'>" + short_level+": </span>" + 
		                                                "<span class='level_desc'>" + level_desc + "</span>" + 
		                                            "</div>" +
		                                            "<div class='manager'>" + manager + "</div>" +
		                                        "</div>" +
		                                    "</div>"
		                    );
		                                
		                $container.find('.level_desc').bind("click" , function(){
		                    var oldDrill = Dashboards.getParameterValue(drillParamName),
		                        newDrill = sears.toggleDimension( oldDrill ),
		                        newFocus = sears.getHistoryItem( rowObj.id, rowObj.label, oldDrill),
		                        history = Dashboards.getParameterValue(historyParamName);
		                    sears.pushToHistory(newFocus, history);
		                    
		                    Dashboards.setParameter( historyParamName, history);
		                    Dashboards.fireChange( drillParamName, newDrill );
		                    Dashboards.log(" 'level_desc' was clicked, triggering an action --> KEY: " + rowObj.id + ",  focusParam: " + focusParam);
		                });
		                
		                var isExpanded = sears.isExpanded(rowObj.isExpanded),
		                    dim = Dashboards.getParameterValue(drillParamName),
		                    numberLevels = _.size( sears.getLevels(dim) ),
		                    indentFactor = rowObj.indentLevel - minIndent;
		                
		                if ( parseInt(rowObj.indentLevel) <= numberLevels ) {
		                    $container.css('padding-left', (indentFactor * 10) + 'px');
		                    $container.find('.expandIcon')
		                            .toggleClass('expanded', isExpanded)
		                            .bind("click" , function(){
		                                $(this).toggleClass('expanded');
		                                var isExpanded = $(this).hasClass('expanded'),
		                                    newLimit = sears.getSettings('defaultLevel3Top'),
		                                    limit = isExpanded ? newLimit : 0,
		                                    expanded = Dashboards.getParameterValue(expandedParamName);
		                                expanded = sears.updateExpanded( rowObj.id, limit, expanded);
		                                Dashboards.fireChange(expandedParamName, expanded);
		                                Dashboards.log("Expand clicked: " + JSON.stringify(expanded) );
		                            });
		                }
		                
		                if ( parseInt(rowObj.indentLevel) == numberLevels )  {  //we are on the last level, so we don't want to show the arrow
		                    $container.find('.expandIcon').css('visibility','hidden');
		                }
		                
		                return $container;
		            };
		        }
		        
		        else if (st.colIdx === indexMap.manager) {    // we will use this column to show the button to add/remove metrics to the chart
		            out.textFormat = function(v, st){
		                
		                var $container = $("<div class='metricButton'> </div>"),
		                    initialSelectedMetrics = Dashboards.getParameterValue(selectedParamName),
		                    isSelected = sears.isSelected(rowObj.id , initialSelectedMetrics);  
		                    
		                $container
		                    .toggleClass('selectedMetric', isSelected)
		                    .bind("click" , function(){
		                        $(this).toggleClass('selectedMetric');
		                        
		                        var selected = Dashboards.getParameterValue(selectedParamName),
		                            id = rowObj.id,
		                            label = rowObj.label,
		                            newSelectedItem = sears.getSelectedItem(id, label);
		                        sears.updateSelected(id, label, selected);
		                        
		                        //Dashboards.log("Select metric button clicked. id:"+id +", label:"+label);
		                        Dashboards.fireChange(selectedParamName, selected);
		                        Dashboards.log("Selected measures: " + JSON.stringify(selected) );
		                    });

		                if (isSelected) {   
		                    $container
		                        .tipsy({
		                            title: function() {
		                                var tipsyContent =  "<div>" +
		                                                        "<div>Metric has been</div>" +
		                                                        "<div>added to graph</div>" +
		                                                    "</div>" ;
		                                return tipsyContent;
		                            },
		                            html: true,
		                            gravity: "s",
		                            opacity: 1
		                        });
		                }
		                    
		                return $container;
		            };
		        }
		        
		        else {  //format numbers
		            out.textFormat = function(v, st){
		                var ftKey = st.tableData[st.rowIdx][st.colIdx-1],
		                    available = sears.isAvailable( st.tableData[st.rowIdx][st.colIdx-2] ),
		                    ft = map[ftKey];
		                return available ? sears.formatValues( ft, v ) : sears.getSettings('notAvailable');
		            };
		        }

		        return out;
		    }
		    this.setAddInOptions("colType","formattedText",formattedTextOpts);
		    

		    function trendArrowOpts(st) {
		        var out = {};
		        out.includeValue = true;
		        out.valueFormat = function(v, format, st){
		                var ftKey = st.tableData[st.rowIdx][st.colIdx+2],
		                    available = sears.isAvailable( st.tableData[st.rowIdx][st.colIdx+1] ),
		                    metric = st.tableData[st.rowIdx][st.colIdx+3],
		                    ft = map[ftKey];
		                return available ? sears.formatValues( ft, metric ) : sears.getSettings('notAvailable');
		        };

		        return out;
		    }
		    this.setAddInOptions("colType","trendArrow",trendArrowOpts);


		    return data;
		}
		,
			postExecution: function f(){
		    
		    var myself = this,
		    $ph = $("#"+ this.htmlObject);

		    var trends = $ph.find('.trend');
		    _.each( trends , function(trend, idx){
		        var trendClasses = $(trend).attr('class'),
		        valuePH = $(trend).siblings().addClass(trendClasses).removeClass('trend good');
		    });
		    
		    /* If we have less than 20 rows in the table, we don't want to show the "Show Next 20" */
		    var nrOfRows = myself.queryState.lastResults().queryInfo.totalRows;
		    if( nrOfRows >= 20 ) {
		        $('<div class="showNext20"><a>Show Next 20</a></div>')
		            .on('click','a',function(){
		                var expanded  = Dashboards.getParameterValue('expandedParam'),
		                    dimKey    = Dashboards.getParameterValue('drilldownFilterParam'),
		                    levelKey  = Dashboards.getParameterValue('levelParam'),
		                    levelMdx  = sears.getDimension(dimKey, "levels", levelKey, 'mdx'),
		                    limit = Dashboards.getParameterValue('limitParam');
		                limit = limit + sears.getSettings('defaultLevel3Top');
		                expanded = sears.updateExpanded( levelMdx, limit, expanded);
		                Dashboards.fireChange('limitParam', limit);
		                Dashboards.fireChange('expandedParam', expanded);
		                Dashboards.log('Increase Limit: ' + JSON.stringify(expanded));
		            })
		            .appendTo( $("#"+ this.htmlObject) );
		            
		            
		            // Prevent the "jump" to the top of the dashboard when we click on the table
		            var tableHeight = $ph.find('table').height(),
		                $showNext20PH = $ph.find('.showNext20'),
		                showNext20TotalHeight = $showNext20PH.height() + 
		                                    ( parseInt($showNext20PH.css('padding-top').replace('px',"")) ) + 
		                                    ( parseInt($showNext20PH.css('padding-bottom').replace('px',"")) );
		            //Dashboards.log("-> showNext20 TOTAL height" + showNext20TotalHeight);
		            $ph.css('min-height', (tableHeight + showNext20TotalHeight)+'px');
		    }
		    else {
		        // Prevent the "jump" to the top of the dashboard when we click on the table
		        var tableHeight = $ph.find('table').height();
		        $ph.css('min-height', tableHeight);
		    }
		    
		    
		    /* *********    Header functionalities    *********
		     *  Sort
		     * "horizontal scroll / columns pagination"         */

		    var sortParam = Dashboards.getParameterValue('sortParam'),
		        sortMeasure = sortParam.measure,
		        sortOrder = sortParam.order;
		    
		    $ph.find('th').each(function(){
		        var headerIdx = sears.getHeaderColIndex(this),
		            headerMeasure = $(this).text();
		            
		        // Add column header wrapper
		        $(this).wrapInner(function() {
		            return "<div class='columnHeader' title='" + headerMeasure + "'></div>";
		        });
		        
		        // Add sortIcons and callbacks
		        var isSorted = (sortMeasure == headerMeasure),
		            headerOrder = isSorted ? sortOrder : "" ,
		            nrOfColumns = myself.queryState.lastResults().metadata.length,
		            measureColumnsParamName =  'measuresColumnsIdxStateParam',
		            measureColumnsIdxState = Dashboards.getParameterValue(measureColumnsParamName),
		            maximumNumberOfExtraMeasuresVisible = sears.getSettings('maximumNumberOfExtraMeasuresVisible');
		            
		        // We've added an extra column in the end, to put the "pagination" icons, 
		        //so we don't want to add the sort funcionality on that last column
		        if ( headerIdx >=9  &&  headerIdx < nrOfColumns ) {
		            //Add sortIcons
		            $(this).find('.columnHeader').append("<div class='sortIcon'> </div>");
		            
		            //Add sort classes / functionality
		            $(this)
		                .addClass('sortable')
		                .click(function(){
		                    var newOrder = sears.toggleHeaderSortOrder( headerOrder ),
		                        newParam = {
		                            measure: headerMeasure,
		                            order: newOrder
		                        };
		                    Dashboards.fireChange('sortParam', newParam);
		                });
		            if (isSorted){
		                $(this).addClass('sorted').addClass( sortOrder );
		            }
		                            
		            if (headerIdx > 9) {
		                var isVisible = measureColumnsIdxState.length < maximumNumberOfExtraMeasuresVisible ? true : false;
		                    sears.populateInitialMeasureColumnVisibility( myself , headerIdx , isVisible , measureColumnsIdxState );
		            }
		            
		        }
		        
		        
		        // TODO: Add pagination function
		        if ( headerIdx == nrOfColumns ) {
		            $(this)
		                .addClass('paginateTH')
		                .find('.columnHeader').detach();
		            
		            var $container = $(
		                    "<div class='paginateWrapper'>" +
		                        "<div class='scrollLeftIcon'> </div>" +
		                        "<div class='scrollRightIcon'> </div>" +
		                    "</div>"
		                );
		            $(this).append( $container );
		            
		            
		            var measures = Dashboards.getParameterValue('measuresParam'),
		                numMeasures = measures.length; 
		                totalNumberOfMeasures = numMeasures-1;    // minus 1, because we already show the "actual metric" on another column (trend)

		            // Check if we have columns to hide
		            if( totalNumberOfMeasures <= maximumNumberOfExtraMeasuresVisible ) {
		                Dashboards.log("Disabling the scroll...");
		                $(this).find('.paginateWrapper').children().addClass('inactive');
		            }
		            else {
		                Dashboards.log("We need to have the scroll enabled");
		                
		                $(this).find('.scrollLeftIcon')
		                    .click(function(){
		                        Dashboards.log("Show previous column");
		                        sears.shiftMeasureColumnVisibilityToLeft( myself, measureColumnsIdxState );
		                        var status = sears.checkScrollStatus('left', measureColumnsIdxState );
		                        if (status == 'disabled') {
		                            $(this).siblings().removeClass('inactive');
		                            $(this).addClass('inactive');
		                            //$(this).unbind();
		                        }
		                });
		                //disable on the beginning
		                $(this).find('.scrollLeftIcon').addClass('inactive');
		                //$(this).find('.scrollLeftIcon.inactive').unbind();
		                                
		                $(this).find('.scrollRightIcon')
		                    .click(function(){
		                        Dashboards.log("Show next column");
		                        sears.shiftMeasureColumnVisibilityToRight( myself, measureColumnsIdxState );
		                        var status = sears.checkScrollStatus('right', measureColumnsIdxState );
		                        if (status == 'disabled') {
		                            $(this).siblings().removeClass('inactive');
		                            $(this).addClass('inactive');
		                            //$(this).unbind();
		                        }
		                });
		                
		                //TODO: disable the clicks when the scroll is inactive!
		                
		                //TODO: fix bug --> when we select one metric to add to the chart, 
		                //all the columns are shown
		                
		            }
		            
		        }
		        
		    });
		    
		    
		    
		    /* Add some widths by default, for the fixed columns */
		    $ph.find('th.column7').css({'min-width':'230px' , 'max-width':'230px' });
		    $ph.find('th.column8').css({'min-width':'50px'  , 'max-width':'50px'  });
		    $ph.find('th.column9').css({'min-width':'130px' , 'max-width':'130px' });
		    
		}
		,
			extraOptions: [],
			expandParameters: [],
			expandOnClick: false,
			chartDefinition:  {
				dataAccessId: "level3MetricsDrilldownQuery",
				path: "/public/Sears/level3.cda",
				colHeaders: [],
				colTypes: [],
				colFormats: [],
				colWidths: [],
				colSortable: [],
				colSearchable: [],
				paginate: false,
				paginateServerside: false,
				paginationType: "two_button",
				filter: false,
				info: false,
				sort: false,
				sortBy: [],
				lengthChange: false,
				tableStyle: "classic"
			}
		};

		var render_trendChart = {
			type: "cccLineChart",
			name: "render_trendChart",
			priority: 5,
			parameters: [["buParam","buParam"],["storeFormatParam","storeFormatParam"],["buDivisionParam","buDivisionParam"],["dashboardParam","dashboardParam"],["metricParam","metricParam"],["timeframeParam","timeframeParam"],["metricBreakdownParam","metricBreakdownParam"],["selectedMetricsParam","JSON.stringify(selectedMetricsParam)"]],
			executeAtStart: false,
			postFetch: function f(data){
		    
		    var measureKeys = _.pluck( data.resultset, '0' );
		    this.chartDefinition.colorMap = sears.getMap(measureKeys);

		},
			htmlObject: "chartObj",
			preExecution: function f(){
		    sears.extendChartOpts(this.chartDefinition, 'lineChart');
		    sears.resetColorMap();
		}
		,
			listeners: ['metricBreakdownParam','selectedMetricsParam'],
			chartDefinition:  {
				dataAccessId: "level3MetricsChartQuery",
				path: "/public/Sears/level3.cda",
				extensionPoints: [],
				colors: [],
				animate: false,
				baseAxisDomainRoundMode: "tick",
				baseAxisDomainScope: "global",
				baseAxisGrid: false,
				baseAxisMinorTicks: true,
				baseAxisOffset: 0,
				baseAxisOverlappedLabelsMode: "hide",
				baseAxisTicks: true,
				baseAxisTitleFont: "12px sans-serif",
				baseAxisTitleMargins: "0",
				baseAxisVisible: true,
				baseAxisZeroLine: true,
				clearSelectionMode: "emptySpaceClick",
				clickable: false,
				color2AxisColors: [],
				color2AxisLegendClickMode: "toggleVisible",
				color2AxisLegendVisible: true,
				compatVersion: 2,
				contentMargins: "0",
				contentPaddings: "0",
				crosstabMode: true,
				ctrlSelectMode: true,
				dataIgnoreMetadataLabels: false,
				dataMeasuresInColumns: false,
				dataSeparator: "~",
				dotsVisible: true,
				groupedLabelSep: " ~ ",
				hoverable: false,
				ignoreNulls: true,
				isMultiValued: false,
				leafContentOverflow: "auto",
				legend: true,
				legendClickMode: "toggleVisible",
				legendFont: "10px sans-serif",
				legendItemPadding: "2.5",
				legendMargins: "0",
				legendMarkerSize: 15,
				legendPaddings: "5",
				legendPosition: "bottom",
				legendTextMargin: 6,
				legendVisible: true,
				margins: "3",
				measuresIndexes: [],
				multiChartColumnsMax: 3,
				multiChartIndexes: [],
				multiChartOverflow: "grow",
				multiChartSingleColFillsHeight: true,
				multiChartSingleRowFillsHeight: true,
				nullInterpolationMode: "none",
				orientation: "vertical",
				ortho2AxisDomainRoundMode: "tick",
				ortho2AxisDomainScope: "global",
				ortho2AxisGrid: false,
				ortho2AxisMinorTicks: true,
				ortho2AxisOffset: 0,
				ortho2AxisOverlappedLabelsMode: "hide",
				ortho2AxisTicks: true,
				ortho2AxisTitleFont: "12px sans-serif",
				ortho2AxisTitleMargins: "0",
				ortho2AxisVisible: true,
				ortho2AxisZeroLine: true,
				orthoAxisDesiredTickCount: 5,
				orthoAxisDomainRoundMode: "tick",
				orthoAxisDomainScope: "global",
				orthoAxisGrid: false,
				orthoAxisMinorTicks: false,
				orthoAxisOffset: 0,
				orthoAxisOverlappedLabelsMode: "hide",
				orthoAxisTicks: true,
				orthoAxisTitleFont: "12px sans-serif",
				orthoAxisTitleMargins: "0",
				orthoAxisVisible: true,
				orthoAxisZeroLine: true,
				paddings: "0",
				plot2: false,
				plot2AreasVisible: false,
				plot2ColorAxis: 2,
				plot2DotsVisible: true,
				plot2LinesVisible: true,
				plot2NullInterpolationMode: "none",
				plot2OrthoAxis: 1,
				plot2Series: [],
				plot2SeriesIndexes: -1,
				plot2Stacked: false,
				plot2ValuesFont: "10px sans-serif",
				plot2ValuesMask: "{value}",
				plot2ValuesVisible: false,
				plotFrameVisible: true,
				selectable: false,
				seriesInRows: false,
				smallContentMargins: "0",
				smallContentPaddings: "0",
				smallMargins: "2%",
				smallPaddings: "0",
				smallTitleFont: "14px sans-serif",
				smallTitleMargins: "0",
				smallTitlePaddings: "0",
				smallTitlePosition: "top",
				timeSeries: false,
				timeSeriesFormat: "%Y-%m-%d",
				titleFont: "14px sans-serif",
				titleMargins: "0",
				titlePaddings: "0",
				titlePosition: "top",
				tooltipEnabled: true,
				tooltipFade: true,
				tooltipFollowMouse: false,
				tooltipHtml: true,
				tooltipOpacity: 0.9,
				trendAreasVisible: false,
				trendColorAxis: 2,
				trendDotsVisible: false,
				trendLinesVisible: true,
				trendOrthoAxis: 1,
				trendStacked: false,
				trendValuesAnchor: "right",
				trendValuesFont: "10px sans-serif",
				trendValuesVisible: false,
				valuesFont: "10px sans-serif"
			}
		};

		Dashboards.addComponents([render_storeFormatSelector, render_buSelector, render_buDivisionSelector, render_dashboardSelector, render_timeframeSelector, render_drilldownFilter, render_levelTabs, render_selectedMetric, render_dashTitle, render_chartTitle, render_addedMetricsFromTable, render_infoTableFocus, render_breakdownTable, render_drilldownTable, render_trendChart]);

	});