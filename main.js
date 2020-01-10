$(document).ready(function() {

    var template_html = $("#giorno-template").html();
    var template_function = Handlebars.compile(template_html);
// -----------------------------
// -------HANDLEBARS------------
// -----------------------------

    var data_iniziale = '2018-01-01';
    var moment_data = moment(data_iniziale);

    // creo due variabili come inizio e fine del calendario
    var inizio_calendario = "2018-01-01";
    var fine_calendario = "2018-12-01";//imposto il giorno 1 invecere del 31 cosi posso usare isSameOrAfter aggiungendo soltanto un mese alla data iniziale

// visualizzo il calendario iniziale con gennaio
    stampa_mese(moment_data);
    stampa_festivita(moment_data);

// intercetto il click sul pulsante succ
    $("#mese_succ").click(function(){
        // controllo che la fata non sfori dalle date disponibili
        if (moment_data.isSameOrAfter(fine_calendario)) {
            alert("mese non disp");
            $(this).prop("disabled", true);//aggiungo la funzione disabled per disattivare la funzionalità del bottone
        }else{
            // aggiungo un mese alla data da visualzzare
            moment_data.add(1, "months");
            // visualizzo il calendario aggiornato
            stampa_mese(moment_data);
            stampa_festivita(moment_data);
        }

    });

// intercetto il click sul pulsante Precedente

    $("#mese_prec").click(function(){
        if (moment_data.isSameOrBefore(inizio_calendario)) {
            alert("mese non disp");
            $(this).prop("disabled", true);//aggiungo la funzione disabled per disattivare la funzionalità del bottone
        }else{
            // aggiungo un mese alla data da visualzzare
            moment_data.subtract(1, "months");
            // visualizzo il calendario aggiornato
            stampa_mese(moment_data);
            stampa_festivita(moment_data);
        }


    });
// ---------------------------
// -------FUNZIONI------------
// ---------------------------
    function stampa_mese(data_mese){
        // resetto il calendario
        $("#calendario").empty();

        // SOLUZIONE A
        // colono la data del mese cosi da poter sommare i giorni
        // var data_mese_giorno = moment(data_mese);

        // recupero i giorni del mese da visulazzioare
            var giorni_mese = data_mese.daysInMonth();
            var mese_testuale = data_mese.format("MMMM");
            mese_testuale = mese_testuale.charAt(0).toUpperCase() + mese_testuale.slice(1);
            // imposto il titolo con il mese corrente
            $("#mese-corrente").text(mese_testuale);


            // con un ciclo for disengo tutti i giorni del mese
            for (var i = 1; i <= giorni_mese; i++) {
                // SOLUZIONE B
                // costruisco il giorno in formato standard
                var giorno_standard = data_mese.format("YYYY-MM-") + formatta_giorno(i);

                var variabili = {
                    day: i + " " + mese_testuale,
                    // standard_day: data_mese_giorno.format("YYY-MM-DD")
                    standard_day: giorno_standard
                };
                var html_finale = template_function(variabili);
                $("#calendario").append(html_finale);

                // data_mese_giorno.add(1, "days");
            };

    };

    function stampa_festivita(data_mese) {
        //chiamata ajax per avere le festività del mese corrente
        $.ajax({
            url:"https://flynn.boolean.careers/exercises/api/holidays",
            method: "GET",
            data: {
                year:2018,
                month:  data_mese.month()
            },
            success:function(data) {
                var festivita = data.response;
                for (var i = 0; i < festivita.length; i++) {
                    var festivita_corrente = festivita[i];
                    var data_festa = festivita_corrente.date;
                    var nome_festa = festivita_corrente.name;

                    // SOLUZIONE A
                    // attraverso l'attributo data, seleziono direttamente l'li giusto
                    var giorno_festa_calendario = $("#calendario li[data-giorno='" + data_festa + "']");
                    giorno_festa_calendario.addClass("festa").append(" - " + nome_festa);

                    // SOLUZIONE B
                    // scorro tutti gli li e controllo il data
                    /*
                    $("#calendario li").each(function(){
                        // recupero il giorno del li
                        var giorno_li = $(this).attr("data-giorno");
                        // controllo se il giorno del calendario è un giorno di festa
                        if(giorno_li == data_festa) {
                            $(this).addClass("festa")
                            $(this).append(" - " + nome_festa)
                        }
                    });
                    */
                };
            },
            error:function(){
                alert("errore")
            }
        });

    };

    function formatta_giorno(giorno){
        if(giorno < 10) {
            return '0' + giorno;

        }else {
            return giorno;
        };
    };

});
