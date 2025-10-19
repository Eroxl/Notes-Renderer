import renderContent from "../renderContent";

const timeline = (content: string) => {
    const events = content
        .split('\n')
        .splice(2)

        .reduce((acc: string[][], line: string, index: number) => {
            if (line.startsWith('date:')) {
                acc.push([line.replace('date:', '').trim(), '']);
            } else if (line.startsWith('title:')) {
                if (acc[acc.length]?.length === 0) {
                    throw new Error(`'title:' found before 'date:' on line ${index + 3}`);
                }

                acc[acc.length - 1][1] = line.replace('title:', '').trim();
            } else if (line.startsWith("content:")) {
                if (acc[acc.length]?.length < 2) {
                    throw new Error(`'content:' found before 'date:' and 'title:' on line ${index + 3}`);
                }

                acc[acc.length - 1][2] = line.replace('content:', '').trim();
            }

            return acc;
        }, []);
        
    return `
    <div class="timeline-container">
        ${events.map(([date, title, content]) => `
            <div class="timeline-event">
                <div class="timeline-event-date">${date || ''}</div>
                <div class="timeline-event-body">
                    <div class="timeline-event-body-content">
                        <div class="timeline-event-title">${title || ''}</div>
                        <div class="timeline-event-content">${
                            renderContent(content || '').html
                        }</div>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
    `;
};

export default timeline;
