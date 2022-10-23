/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProjectAPI } from '~~/src/apis/ProjectAPI'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { StatusAPI } from '~~/src/apis/StatusAPI'

export const testSeeder = async () => {
  const dayjs = useDayjs()

  /// ////////////////////////////////////////
  // プロジェクト

  const p1 = await ProjectAPI.create({
    name: '案件A',
    color: '#96245c',
    icon: 'A',
  })

  const p2 = await ProjectAPI.create({
    name: '案件B',
    color: '#168d6a',
    icon: 'B',
  })

  const p3 = await ProjectAPI.create({
    name: 'ZXC案件',
  })

  const p4 = await ProjectAPI.create({
    name: 'Tips',
    icon: '😎',
  })

  const p5 = await ProjectAPI.create({
    name: 'Sample',
  })

  /// ////////////////////////////////////////
  // ステータス

  const s1 = await StatusAPI.create({
    name: '重要',
    color: '#dc3545',
  })

  const s2 = await StatusAPI.create({
    name: '待ち',
    color: '#8dd0ff',
  })

  const s3 = await StatusAPI.create({
    name: '保留',
    color: '#fec89a',
  })

  /// ////////////////////////////////////////
  // レポート

  const r1 = await ReportAPI.create({
    text: 'サンプルテキストです\n・あいうえお\n・かきくけこ\n・さしすせそ',
    projectId: p1.id,
    statusId: s1.id,
    isStar: true,
    startAt: dayjs('2022-10-19 10:12:33'),
    endAt: dayjs('2022-10-19 12:01:00'),
  })

  const r2 = await ReportAPI.create({
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt\n' +
      'quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!',
    projectId: p2.id,
    statusId: undefined,
    isStar: false,
    startAt: dayjs('2022-10-19 13:00:33'),
  })

  const r3 = await ReportAPI.create({
    text: 'この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。' +
      'この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。' +
      'この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。',
    projectId: p4.id,
    statusId: s2.id,
    isStar: false,
    startAt: dayjs('2022-10-19 13:00:33'),
  })

  const r4 = await ReportAPI.create({
    text: '〇〇を△にする作業\n・見る\n・調べる\n・作る\n\nどうよ。',
    projectId: p1.id,
    statusId: s2.id,
    isStar: false,
  })

  const r5 = await ReportAPI.create({
    text: 'tips tips tips tips\ntips tips tips tips\ntips tips tips tips',
    projectId: p4.id,
    statusId: s2.id,
    isStar: true,
  })

  // 一日5件くらい適当に
  let base = dayjs('2022-10-01')
  for (let i = 0; i < 20; i++) {
    await ReportAPI.create({
      text: base.format('YYYY-MM-dd HH:mm:ss のメモ'),
      projectId: p5.id,
      isStar: true,
      startAt: base.clone(),
    })

    base = base.add(8, 'hours')
  }
}
