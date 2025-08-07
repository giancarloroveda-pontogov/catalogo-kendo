export default function configureCulture() {
	kendo.cultures["pt-BR"].numberFormat.currency.symbol = "R$ ";
	kendo.culture("pt-BR");
}