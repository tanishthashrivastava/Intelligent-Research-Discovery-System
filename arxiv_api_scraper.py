import feedparser
import pandas as pd

url = "http://export.arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=100"

feed = feedparser.parse(url)

data = []

for entry in feed.entries:

    title = entry.title
    authors = ", ".join(author.name for author in entry.authors)
    summary = entry.summary
    published = entry.published
    link = entry.link
    pdf_link = entry.links[1].href if len(entry.links) > 1 else ""
    category = entry.tags[0]['term'] if 'tags' in entry else ""

    data.append({
        "Title": title,
        "Authors": authors,
        "Abstract": summary,
        "Published": published,
        "Category": category,
        "PDF_Link": pdf_link,
        "Link": link
    })

df = pd.DataFrame(data)

df.to_csv("arxiv_papers.csv", index=False)

print("Dataset saved successfully")