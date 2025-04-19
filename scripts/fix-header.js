const fs = require('fs');
const path = require('path');

console.log('🔧 開始修復 Header.tsx 文件...');

// 檢查 Header.tsx 文件
const headerFilePath = path.join(__dirname, '../app/components/Header.tsx');
if (fs.existsSync(headerFilePath)) {
  let headerContent = fs.readFileSync(headerFilePath, 'utf8');
  
  // 修改文件內容，將 memberLevel 轉換為字符串
  const updatedContent = headerContent.replace(
    /user\.memberLevel \? getMemberLevelName\(user\.memberLevel\)/g,
    'user.memberLevel ? getMemberLevelName(String(user.memberLevel))'
  ).replace(
    /getMemberLevelColorClass\(user\.memberLevel\)/g,
    'getMemberLevelColorClass(String(user.memberLevel))'
  );
  
  if (updatedContent !== headerContent) {
    fs.writeFileSync(headerFilePath, updatedContent, 'utf8');
    console.log(`   ✅ 已修復 Header.tsx 文件，添加了字符串轉換`);
  } else {
    console.log(`   ⚠️ 未找到可修改的部分`);
  }
} else {
  console.log(`   ❌ 找不到 Header.tsx 文件`);
}

// 檢查 MemberPage.tsx 文件
const memberPageFilePath = path.join(__dirname, '../app/member/page.tsx');
if (fs.existsSync(memberPageFilePath)) {
  let memberPageContent = fs.readFileSync(memberPageFilePath, 'utf8');
  
  // 修改文件內容，將 memberLevel 轉換為字符串
  const updatedMemberPageContent = memberPageContent.replace(
    /user\.memberLevel \? getMemberLevelName\(user\.memberLevel\)/g,
    'user.memberLevel ? getMemberLevelName(String(user.memberLevel))'
  ).replace(
    /getMemberLevelColorClass\(user\.memberLevel\)/g,
    'getMemberLevelColorClass(String(user.memberLevel))'
  );
  
  if (updatedMemberPageContent !== memberPageContent) {
    fs.writeFileSync(memberPageFilePath, updatedMemberPageContent, 'utf8');
    console.log(`   ✅ 已修復 member/page.tsx 文件，添加了字符串轉換`);
  } else {
    console.log(`   ⚠️ 未找到可修改的部分`);
  }
} else {
  console.log(`   ⚠️ 找不到 member/page.tsx 文件`);
}

console.log('🎉 完成！已直接修復文件中的類型問題。'); 