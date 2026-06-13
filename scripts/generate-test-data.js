const Database = require('better-sqlite3');

const KNOWLEDGE_POINTS = [
  '运算符 — 赋值 = 与判断相等 == 混用',
  '运算符 — 不等号！= 误写为 <> 、 =/ 等错误格式',
  '运算符 — 逻辑运算符 and/or/not 中英文写法混淆',
  '运算符 — 算术运算符 +、-、*、/、//、% 优先级理解错误',
  '运算符 — 整除 // 、取余 % 使用场景与计算错误',
  '运算符 — 自增 += 、自减 -= 复合赋值运算符书写错误',
  '标点符号 — 代码中混用中文逗号、英文逗号',
  '标点符号 — 圆括号 () 中英文混用、括号配对缺失',
  '标点符号 — 单引号 / 双引号中英文混用、引号嵌套出错',
  '标点符号 — 列表 [] 、字典 {} 括号书写错误、配对不全',
  '语句标识 —if/for/while/def 语句末尾缺失冒号 :',
  '语句标识 — 多余添加分号；，画蛇添足',
  '缩进 — 循环、条件语句代码块未缩进',
  '缩进 — 多层代码块缩进层级错乱',
  '缩进 — 空格缩进与 Tab 缩进混合使用',
  '缩进 — 缩进空格数量不统一（非 4 个标准空格）',
  '排版 — 代码行首尾出现多余空格',
  '排版 — 功能模块间空行过多 / 缺失空行',
  '排版 — 单行堆砌大量代码，无合理换行',
  '变量 — 使用前未定义变量',
  '变量 — 变量名使用 Python 关键字（if、for、def 等）',
  '变量 — 变量名使用中文、特殊符号、数字开头',
  '变量 — 使用 a/b/c/x/y 等无意义单字母命名（规范扣分）',
  '变量 — 同一作用域内变量重复定义、覆盖原值',
  '变量 — 全局变量与局部变量混用、调用错误',
  '变量 — 变量赋值顺序颠倒，先使用后赋值',
  '数据类型 — 字符串与数字直接拼接，未做类型转换',
  '数据类型 — input() 输入默认是字符串未转换',
  '数据类型 — 列表、字典索引访问越界',
  '数据类型 — 字典键名使用可变类型（列表等）',
  '数据类型 — 字符串索引修改报错（字符串不可变）',
  '数据类型 — None 与空字符串""、0、[]、{} 判断混淆',
  '流程控制 — if 语句条件表达式书写错误',
  '流程控制 — if-elif-else 分支逻辑覆盖不全',
  '流程控制 — while 循环缺少终止条件导致死循环',
  '流程控制 — for 循环 range() 参数使用错误',
  '流程控制 — break/continue 语句使用位置错误',
  '流程控制 — 三目运算符表达式逻辑错误',
  '循环 — 循环中修改迭代对象导致异常',
  '循环 — 嵌套循环层级过多、逻辑复杂难以理解',
  '循环 — 列表遍历时直接修改列表元素',
  '函数 — 函数定义与调用参数数量不匹配',
  '函数 — 函数参数默认值使用可变对象（列表、字典）',
  '函数 — return 语句缺失导致返回 None',
  '函数 — 递归函数缺少终止条件',
  '函数 — 全局变量在函数内修改未声明 global',
  '函数 — 函数名与内置函数重名（如 list、str、print）',
  '列表 — 列表索引从 1 开始而非从 0 开始',
  '列表 — 列表切片语法 [start:end] 理解错误',
  '列表 — 列表方法 append() 与 extend() 混用',
  '列表 — 删除列表元素时迭代导致索引错乱',
  '列表 — 列表比较时只比较第一个元素',
  '字典 — 访问不存在的键导致 KeyError',
  '字典 — 字典遍历方式错误（只遍历键未遍历值）',
  '字典 — 字典键值对顺序依赖错误（Python 3.7+有序）',
  '字典 — 使用 dict[key] 访问前未判断键是否存在',
  '文件操作 — 文件路径使用反斜杠未转义',
  '文件操作 — 打开文件后未关闭导致资源泄漏',
  '文件操作 — 读写模式混淆（r、w、a、r+、w+等）',
  '文件操作 — 大文件一次性读取导致内存溢出',
  '异常处理 — try-except 捕获范围过宽',
  '异常处理 — except 后未指定异常类型',
  '异常处理 — 异常处理中吞掉错误未记录日志',
  '异常处理 — finally 块中返回值覆盖 try 块返回值',
  '模块导入 — 导入语句位置错误（应在文件顶部）',
  '模块导入 — 循环导入导致错误',
  '模块导入 — 未使用的导入语句',
  '模块导入 — 相对导入与绝对导入混用',
];

const QUESTIONS = [
  '编写一个函数，计算两个数的和',
  '编写一个程序，输出1到100的所有偶数',
  '编写一个函数，判断一个数是否为质数',
  '编写一个程序，求列表中所有元素的平均值',
  '编写一个函数，反转一个字符串',
  '编写一个程序，统计字符串中每个字符出现的次数',
  '编写一个函数，找出列表中的最大值和最小值',
  '编写一个程序，实现简单的计算器功能',
  '编写一个函数，判断闰年',
  '编写一个程序，打印九九乘法表',
];

const STUDENT_PREFIXES = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
const STUDENT_SUFFIXES = ['伟', '强', '芳', '娜', '敏', '静', '磊', '军', '洋', '波'];

function generateStudentName() {
  const prefix = STUDENT_PREFIXES[Math.floor(Math.random() * STUDENT_PREFIXES.length)];
  const suffix = STUDENT_SUFFIXES[Math.floor(Math.random() * STUDENT_SUFFIXES.length)];
  return prefix + suffix;
}

function generateCode() {
  const codes = [
    `def add(a, b):
    return a + b`,
    `for i in range(1, 101):
    if i % 2 == 0:
        print(i)`,
    `def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True`,
    `nums = [1, 2, 3, 4, 5]
average = sum(nums) / len(nums)
print(average)`,
    `def reverse_string(s):
    return s[::-1]`,
    `s = "hello world"
count = {}
for char in s:
    count[char] = count.get(char, 0) + 1
print(count)`,
  ];
  return codes[Math.floor(Math.random() * codes.length)];
}

function generateScore(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getLevel(score) {
  if (score >= 85) return '优秀';
  if (score >= 70) return '良好';
  if (score >= 60) return '及格';
  return '待提升';
}

function generateHint() {
  const hints = [
    '代码逻辑正确，但可以优化变量命名',
    '建议添加更多注释说明',
    '代码结构清晰，继续保持',
    '注意代码缩进规范',
    '可以考虑使用更简洁的语法',
    '建议增加异常处理',
  ];
  return hints[Math.floor(Math.random() * hints.length)];
}

function generatePractice() {
  const practices = [
    '多练习条件判断语句',
    '加强循环结构的理解',
    '建议学习函数封装',
    '多做代码调试练习',
    '复习数据类型转换',
  ];
  return practices[Math.floor(Math.random() * practices.length)];
}

function generateKnowledgePoints(count = 2) {
  const points = [];
  const shuffled = [...KNOWLEDGE_POINTS].sort(() => Math.random() - 0.5);
  for (let i = 0; i < count && i < shuffled.length; i++) {
    points.push(shuffled[i]);
  }
  return points;
}

function generateTimestamp() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

const db = new Database('./data/evaluations.db');

try {
  db.exec('DELETE FROM evaluation_records');
  
  const students = new Set();
  while (students.size < 136) {
    students.add(generateStudentName());
  }
  
  const studentList = Array.from(students);
  let totalRecords = 0;
  
  studentList.forEach((studentName) => {
    const question = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    const code = generateCode();
    
    const firstUnderstanding = generateScore(50, 84);
    const firstLogic = generateScore(50, 84);
    const firstReadability = generateScore(50, 84);
    const firstSyntax = generateScore(50, 84);
    const firstTotal = Math.round((firstUnderstanding + firstLogic + firstReadability + firstSyntax) / 4);
    
    const secondUnderstanding = generateScore(85, 100);
    const secondLogic = generateScore(85, 100);
    const secondReadability = generateScore(85, 100);
    const secondSyntax = generateScore(85, 100);
    const secondTotal = Math.round((secondUnderstanding + secondLogic + secondReadability + secondSyntax) / 4);
    
    const stmt = db.prepare(`INSERT INTO evaluation_records (
      student_name, question, code, understanding_score, logic_score,
      readability_score, syntax_score, total_score, level, hint,
      practice, knowledge_points, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    stmt.run(
      studentName,
      question,
      code,
      firstUnderstanding,
      firstLogic,
      firstReadability,
      firstSyntax,
      firstTotal,
      getLevel(firstTotal),
      generateHint(),
      generatePractice(),
      JSON.stringify(generateKnowledgePoints()),
      generateTimestamp()
    );
    
    stmt.run(
      studentName,
      question,
      code,
      secondUnderstanding,
      secondLogic,
      secondReadability,
      secondSyntax,
      secondTotal,
      getLevel(secondTotal),
      generateHint(),
      generatePractice(),
      JSON.stringify(generateKnowledgePoints()),
      generateTimestamp()
    );
    
    totalRecords += 2;
  });
  
  console.log(`成功生成 ${totalRecords} 条测试记录`);
} catch (err) {
  console.error('生成测试数据失败:', err);
} finally {
  db.close();
}
