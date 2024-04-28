export function parseDateToString(date?: Date): string {
  // Se não for fornecida uma date, assume a date atual
  if (!date) {
    date = new Date();
  }

  // Obtendo os componentes da date (year, mês, day)
  let year: number = date.getFullYear();
  let month: string = (date.getMonth() + 1).toString().padStart(2, "0"); // O mês é baseado em zero, então adicionamos 1
  let day: string = date.getDate().toString().padStart(2, "0");

  // Formatando a date no formato desejado
  let formatedDate: string = `${year}-${month}-${day}`;

  return formatedDate;
}

// verifica se pelo menos um item de uma base de dados possui valor da coluna passada como parâmetro
export function tableColumnHasValue(column: string, data: any[]): boolean {
  return data.some((item) => item[column] && item[column] !== "");
}
