"""
Django management command to create parties and candidates CSV files.
"""
import csv
import os
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create parties.csv and candidates.csv files with proper UTF-8 encoding'

    def handle(self, *args, **options):
        base_dir = 'files'
        
        # Create parties.csv
        parties_file = os.path.join(base_dir, 'parties.csv')
        parties = [
            'الإئتلاف',
            'التغيير'
        ]
        
        with open(parties_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['party_name'])
            for party in parties:
                writer.writerow([party])
        
        self.stdout.write(self.style.SUCCESS(f'Created {parties_file}'))
        
        # Create candidates.csv
        candidates_file = os.path.join(base_dir, 'candidates.csv')
        candidates = [
            [1, 'خالد محمد مبارك الخضير', 'الإئتلاف'],
            [2, 'نصار صنيتان فلاح المطيري', 'الإئتلاف'],
            [3, 'يوسف يعقوب بعضاء الكندي', 'الإئتلاف'],
            [4, 'فلاح سعد ناهي العازمي', 'الإئتلاف'],
            [5, 'مشعل عبد العزيز قائم العميري', 'الإئتلاف'],
            [6, 'أحمد جاسم الفيحان الشمري', 'الإئتلاف'],
            [7, 'م. سالم علي ابراهيم الكندي', 'الإئتلاف'],
            [8, 'محمد جلال الجلال السهلي', 'الإئتلاف'],
            [9, 'م. جابر مبارك العاده البغيلي', 'الإئتلاف'],
            [10, 'محمد محمود محمد الصباق', 'الإئتلاف'],
            [11, 'م. بالد محمد خفران العازمي', 'الإئتلاف'],
            [12, 'عبدالله يوسف حاجي الفيلكاوي', 'الإئتلاف'],
            [13, 'م. فيصل أحمد علي الكندي', 'الإئتلاف'],
            [14, 'حميد أحمد قربان حجي', 'الإئتلاف'],
            [15, 'نواف عبدالله التحاميل الفضلي', 'الإئتلاف'],
            [16, 'سيف محمد القحطاني', 'التغيير'],
            [17, 'أنس حسن الصميط', 'التغيير'],
            [18, 'حسين علي العريان', 'التغيير'],
            [19, 'حمد عدنان الكندري', 'التغيير'],
            [20, 'عايض سفر الهاجري', 'التغيير'],
            [21, 'حمد زكريا سالم السالم', 'التغيير'],
            [22, 'محسن غازي بويابس', 'التغيير'],
            [23, 'محمد احمد الرشيد', 'التغيير'],
            [24, 'عبد الرحمن عبد العزيز الرشود', 'التغيير'],
            [25, 'عبد الله صلاح الدرباس', 'التغيير'],
            [26, 'محمد اسحاق الفيلكاوي', 'التغيير'],
            [27, 'مصطفى عادل علوم', 'التغيير'],
            [28, 'عبد العزيز عبد الله الكندري', 'التغيير'],
            [29, 'محمد خلف الشيباني', 'التغيير'],
            [30, 'صلاح الدين طعمة الشعري', 'التغيير']
        ]
        
        with open(candidates_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['number', 'name', 'party'])
            writer.writerows(candidates)
        
        self.stdout.write(self.style.SUCCESS(f'Created {candidates_file}'))
        self.stdout.write(self.style.SUCCESS(f'\nTotal parties: {len(parties)}'))
        self.stdout.write(self.style.SUCCESS(f'Total candidates: {len(candidates)}'))

