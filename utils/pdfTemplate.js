const generatePdfTemplate = (data, logoBase64, currentDate, reportPeriod) => {
    return {
        content: [
            {
                stack: [
                    {
                        text: 'Incident Reports',
                        style: 'header',
                        alignment: 'center'
                    },
                    {
                        text: currentDate,
                        style: 'subheader',
                        alignment: 'center'
                    },
                    {
                        text: `Report Period: ${reportPeriod}`,
                        style: 'subheader',
                        alignment: 'center'
                    }
                ],
                margin: [0, 200, 0, 0],
                pageBreak: 'after'
            },
            ...data.map(report => ({
                stack: [
                    {
                        style: 'tableExample',
                        table: {
                            widths: ['*', '*'],
                            body: [
                                [{ text: 'Report ID', style: 'tableHeader' }, report['Report ID']],
                                [{ text: 'Incident Type', style: 'tableHeader' }, report['Incident Type']],
                                [{ text: 'Report Description', style: 'tableHeader' }, report['Report Description']],
                                [{ text: 'Incident Sub Type', style: 'tableHeader' }, report['Incident Sub Type']],
                                [{ text: 'Reporting Location', style: 'tableHeader' }, report['Reporting Location']],
                                [{ text: 'Reporting Sub Location', style: 'tableHeader' }, report['Reporting Sub Location']],
                                [{ text: 'Incident Criticality', style: 'tableHeader' }, report['Incident Criticality']],
                                [{ text: 'Report Completion Status', style: 'tableHeader' }, report['Report Completion Status']],
                            ]
                        },
                        layout: 'lightHorizontalLines'
                    },
                    {
                        text: 'Incident Image',
                        style: 'subheader',
                        margin: [0, 20, 0, 5]
                    },
                    report['Image'] ? {
                        image: report['Image'],
                        width: 250,
                        height: 250,
                        alignment: 'center',
                        fit: [250, 250],
                        margin: [0, 0, 0, 20]
                    } : {
                        text: 'No Image Available',
                        alignment: 'center',
                        margin: [0, 0, 0, 20]
                    },
                    {
                        text: '',
                        pageBreak: data.indexOf(report) < data.length - 1 ? 'after' : ''
                    }
                ]
            }))
        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                alignment: 'center',
                margin: [0, 20, 0, 10]
            },
            subheader: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 10, 0, 5]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            }
        },
        defaultStyle: {
            font: 'Helvetica'
        },
        header: (currentPage, pageCount) => {
            if (currentPage === 1) {
                return {};
            }
            return {
                image: logoBase64,
                width: 50,
                alignment: 'right',
                margin: [0, 10, 10, 0]
            };
        },
        footer: (currentPage, pageCount) => {
            if (currentPage === 1) {
                return {};
            }
            return {
                text: `Page ${currentPage} of ${pageCount}`,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            };
        }
    };
};

const generateActionReportPdfTemplate = (data, logoBase64, currentDate, reportPeriod) => {
    return {
        content: [
            {
                stack: [
                    {
                        text: 'Action Reports',
                        style: 'header',
                        alignment: 'center'
                    },
                    {
                        text: currentDate,
                        style: 'subheader',
                        alignment: 'center'
                    },
                    {
                        text: `Report Period: ${reportPeriod}`,
                        style: 'subheader',
                        alignment: 'center'
                    }
                ],
                margin: [0, 200, 0, 0],
                pageBreak: 'after'
            },
            ...data.map(report => ({
                stack: [
                    {
                        style: 'tableExample',
                        table: {
                            widths: ['*', '*', '*'],
                            body: [
                                [{ text: 'Action Report ID', style: 'tableHeader' }, { text: report['Action Report ID'], colSpan: 2 }, ''],
                                [{ text: 'Reported By', style: 'tableHeader' }, { text: report['Reported By'], colSpan: 2 }, ''],
                                [{ text: 'Report Description', style: 'tableHeader' }, { text: report['Report Description'], colSpan: 2 }, ''],
                                [{ text: 'Problem Statement', style: 'tableHeader' }, { text: report['Problem Statement'], colSpan: 2 }, ''],
                                [{ text: 'Question 2', style: 'tableHeader' }, { text: report['Question 2'], colSpan: 2 }, ''],
                                [{ text: 'Question 3', style: 'tableHeader' }, { text: report['Question 3'], colSpan: 2 }, ''],
                                [{ text: 'Question 4', style: 'tableHeader' }, { text: report['Question 4'], colSpan: 2 }, ''],
                                [{ text: 'Root Cause', style: 'tableHeader' }, { text: report['Root Cause'], colSpan: 2 }, ''],
                                [{ text: 'Resolution Description', style: 'tableHeader' }, { text: report['Resolution Description'], colSpan: 2 }, ''],
                                [{ text: 'Action Team', style: 'tableHeader' }, { text: report['Action Team'], colSpan: 2 }, ''],
                                [{ text: 'Reporting Date Time', style: 'tableHeader' }, { text: report['Reporting Date Time'], colSpan: 2 }, ''],
                                [{ text: 'Incident Report ID', style: 'tableHeader' }, { text: report['Incident Report ID'], colSpan: 2 }, ''],
                                [{ text: 'Incident Report Description', style: 'tableHeader' }, { text: report['Incident Report Description'], colSpan: 2 }, ''],
                            ]
                        },
                        layout: 'lightHorizontalLines'
                    },
                    {
                        text: 'Images',
                        style: 'subheader',
                        margin: [0, 20, 0, 5]
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: ['*', '*'],
                            body: [
                                [{ text: 'Surrounding Image', style: 'tableHeader' }, { text: 'Proof Image', style: 'tableHeader' }],
                                [
                                    report['Surrounding Image'] ? {
                                        image: report['Surrounding Image'],
                                        width: 250,
                                        height: 250,
                                        fit: [250, 250],
                                        alignment: 'center'
                                    } : {
                                        text: 'No Image Available',
                                        alignment: 'center'
                                    },
                                    report['Proof Image'] ? {
                                        image: report['Proof Image'],
                                        width: 250,
                                        height: 250,
                                        fit: [250, 250],
                                        alignment: 'center'
                                    } : {
                                        text: 'No Image Available',
                                        alignment: 'center'
                                    }
                                ]
                            ]
                        },
                        layout: 'lightHorizontalLines'
                    },
                    {
                        text: '',
                        pageBreak: data.indexOf(report) < data.length - 1 ? 'after' : ''
                    }
                ]
            }))
        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                alignment: 'center',
                margin: [0, 20, 0, 10]
            },
            subheader: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 10, 0, 5]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            }
        },
        defaultStyle: {
            font: 'Helvetica'
        },
        header: (currentPage, pageCount) => {
            if (currentPage === 1) {
                return {};
            }
            return {
                image: logoBase64,
                width: 50,
                alignment: 'right',
                margin: [0, 10, 10, 0]
            };
        },
        footer: (currentPage, pageCount) => {
            if (currentPage === 1) {
                return {};
            }
            return {
                text: `Page ${currentPage} of ${pageCount}`,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            };
        }
    };
};

module.exports = {
    generatePdfTemplate,
    generateActionReportPdfTemplate
};
