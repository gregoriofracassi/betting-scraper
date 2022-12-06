export const URL = 'https://www.betclic.it/scommesse/calcio/serie-a_1_31_33'

export const getSelectors = () => {
    return {
        week_buttons: {
            //check again, selecotr may expire after 1 day
            do: '#sidebar-sx > div.widget-filtro-side.bordato-widget.bordo-tondo.margine-giu > div.elementi-widget-fasce > div.filtro-settimana.maiuscolo.allinea-centro > a:nth-child(6)',
            lu: '#sidebar-sx > div.widget-filtro-side.bordato-widget.bordo-tondo.margine-giu > div.elementi-widget-fasce > div.filtro-settimana.maiuscolo.allinea-centro > a:nth-child(7)',
            ma: '#sidebar-sx > div.widget-filtro-side.bordato-widget.bordo-tondo.margine-giu > div.elementi-widget-fasce > div.filtro-settimana.maiuscolo.allinea-centro > a:nth-child(1)',
            me: '#sidebar-sx > div.widget-filtro-side.bordato-widget.bordo-tondo.margine-giu > div.elementi-widget-fasce > div.filtro-settimana.maiuscolo.allinea-centro > a:nth-child(2)',
            gi: '#sidebar-sx > div.widget-filtro-side.bordato-widget.bordo-tondo.margine-giu > div.elementi-widget-fasce > div.filtro-settimana.maiuscolo.allinea-centro > a:nth-child(3)',
            ve: '#sidebar-sx > div.widget-filtro-side.bordato-widget.bordo-tondo.margine-giu > div.elementi-widget-fasce > div.filtro-settimana.maiuscolo.allinea-centro > a:nth-child(4)',
            sa: '#sidebar-sx > div.widget-filtro-side.bordato-widget.bordo-tondo.margine-giu > div.elementi-widget-fasce > div.filtro-settimana.maiuscolo.allinea-centro > a:nth-child(5)',
        },
        articles: 'div.tabellaQuoteNew',
        teams: 'd.tabellaQuoteSquadre p',

    }
}