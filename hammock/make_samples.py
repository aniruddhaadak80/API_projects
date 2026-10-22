# Generates the two FICTIONAL sample chats shipped with Hammock.
# Names, events and numbers are invented for the demo.
import random
random.seed(7)

def fmt(d, h, m, who, text):
    ap = 'am' if h < 12 else 'pm'
    hh = h % 12 or 12
    return f"{d}/10/26, {hh}:{m:02d} {ap} - {who}: {text}"

# ---------- Family group ----------
fam = ["22/10/26, 9:00 am - Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. Learn more.",
       fmt(22, 21, 14, 'Arjun', 'Good night everyone, early shift tomorrow')]
noise = ['Good morning 🌸🙏', '<Media omitted>', '🙏🙏🙏', 'Good morning ☀️ Have a blessed day', 'This message was deleted',
         '🌹🌹', 'Jai Mata Di 🙏', '<Media omitted>', 'Very nice 👍', 'Suprobhat 🌼', '😂😂😂', 'Forwarded: 10 health benefits of warm water every morning!!']
people = ['Ma', 'Baba', 'Pishi', 'Mama', 'Tumpa Di', 'Bubai']
signal = [
    (23, 7, 41, 'Pishi', "Rini's wedding is moved from 5 Dec to 12 Dec, the hall had a double booking. Please change your tickets"),
    (23, 7, 58, 'Mama', 'Oh no. Who all have booked trains already?'),
    (23, 8, 5, 'Baba', 'I have, I will cancel and rebook for 11 Dec night Howrah'),
    (23, 9, 12, 'Ma', "@Arjun did you book your leave for the wedding? Tell us before Sunday so Baba can book your seat with ours"),
    (23, 11, 30, 'Tumpa Di', 'Mehendi will be on 11 Dec evening at Pishi house'),
    (23, 13, 2, 'Bubai', 'Can someone send the new card? Old one has 5 Dec'),
    (23, 13, 15, 'Pishi', 'New card will come Saturday'),
    (23, 18, 40, 'Ma', 'Arjun also please call Dida this week, she was asking for you'),
    (23, 20, 10, 'Mama', 'Gift contribution is 2000 each, send to Tumpa by UPI before 1 Dec'),
    (23, 20, 26, 'Tumpa Di', 'Yes UPI to me, I will make the list'),
]
msgs = []
for (d, h, m, who, t) in signal:
    msgs.append((d, h, m, who, t))
for i in range(64):
    h = random.randint(6, 22); m = random.randint(0, 59)
    msgs.append((23, h, m, random.choice(people), random.choice(noise)))
msgs.sort(key=lambda x: (x[0], x[1], x[2]))
fam += [fmt(*x) for x in msgs]
open('samples/family-group.txt', 'w').write('\n'.join(fam) + '\n')

# ---------- Hackathon team group (iOS style timestamps) ----------
def ios(d, h, m, s, who, text):
    ap = 'AM' if h < 12 else 'PM'
    hh = h % 12 or 12
    return f"[{d}/10/26, {hh}:{m:02d}:{s:02d} {ap}] {who}: {text}"
team = [
    ios(22, 23, 50, 1, 'Arjun', 'pushed the parser, going to sleep. ping me if the build breaks'),
    ios(23, 0, 40, 12, 'Meera', 'build is broken on main 😭 the onnx import fails in safari'),
    ios(23, 0, 41, 3, 'Meera', 'nvm it was my cache. works now'),
    ios(23, 1, 15, 44, 'Kabir', 'lol'),
    ios(23, 1, 16, 2, 'Kabir', '‎sticker omitted'),
    ios(23, 2, 3, 9, 'Sana', 'Judging criteria says writing quality is weighted most. We need the blog post draft by Saturday'),
    ios(23, 2, 4, 30, 'Sana', 'I can do the intro + demo gif. Who takes the technical section?'),
    ios(23, 2, 20, 0, 'Kabir', '@Arjun you wrote the parser, can you write the how-it-works part?\nmaybe 300 words, with the regex story'),
    ios(23, 2, 22, 15, 'Meera', '+1'),
    ios(23, 2, 22, 40, 'Kabir', '‎image omitted'),
    ios(23, 3, 1, 5, 'Sana', 'Also the demo video has to be under 2 min'),
    ios(23, 3, 30, 33, 'Meera', 'I will record it Friday night'),
    ios(23, 4, 2, 2, 'Kabir', 'ok sleeping'),
    ios(23, 4, 2, 9, 'Kabir', '😴'),
    ios(23, 4, 10, 0, 'Meera', 'Arjun when you wake up, can you check if the model loads on your old laptop? mine has a GPU so I cannot test the wasm path'),
]
open('samples/hackathon-team.txt', 'w').write('\n'.join(team) + '\n')
print(len(fam), len(team))
