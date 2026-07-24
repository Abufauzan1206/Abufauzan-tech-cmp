/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Foundation Module: FM-007
 * Component: CMPTable
 * Version: 1.0.0
 * =====================================================
 */

export class CMPTable {

  constructor(tableId) {

    this.table =
      document.getElementById(tableId);

    this.tbody =
  this.table?.querySelector("tbody");

this.currentPage = 1;

this.rowsPerPage = 10;

this.allRows = [];

this.filteredRows = [];

  }

  clear() {

    if (this.tbody) {

      this.tbody.innerHTML = "";

    }

  }
  
  render(rows) {

  if (!this.tbody) return;

  this.allRows = [...rows];

  this.filteredRows = [...rows];

  this.currentPage = 1;

  this.showPage(this.currentPage);

}

showPage(page) {

  if (!this.tbody) return;

  this.clear();

  const start =
    (page - 1) * this.rowsPerPage;

  const end =
    start + this.rowsPerPage;

  this.filteredRows
    .slice(start, end)
    .forEach(row => {

      this.tbody.insertAdjacentHTML(
        "beforeend",
        row
      );

    });

}

nextPage() {

  if (this.currentPage < this.getTotalPages()) {

    this.currentPage++;

    this.showPage(this.currentPage);

  }

}

previousPage() {

  if (this.currentPage > 1) {

    this.currentPage--;

    this.showPage(this.currentPage);

  }

}

getTotalPages() {

  return Math.ceil(

    this.filteredRows.length /

    this.rowsPerPage

  );

}

goToPage(page) {

  if (
    page >= 1 &&
    page <= this.getTotalPages()
  ) {

    this.currentPage = page;

    this.showPage(page);

  }

}

search(keyword) {

  const text = keyword.toLowerCase();

  this.filteredRows = this.allRows.filter(row => {

    return row
      .toLowerCase()
      .includes(text);

  });

  this.currentPage = 1;

  this.showPage(this.currentPage);

}

sort(columnIndex, ascending = true) {

  this.allRows.sort((rowA, rowB) => {

    const parser = new DOMParser();

    const trA = parser.parseFromString(
      rowA,
      "text/html"
    ).querySelector("tr");

    const trB = parser.parseFromString(
      rowB,
      "text/html"
    ).querySelector("tr");

    const valueA =
      trA.cells[columnIndex].textContent.trim();

    const valueB =
      trB.cells[columnIndex].textContent.trim();

    return ascending
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);

  });

  this.showPage(this.currentPage);

}

}